import {
    TextField,
    IndexTable,
    Card,
    IndexFilters,
    useSetIndexFiltersMode,
    useIndexResourceState,
    useBreakpoints,
    Divider,
    Button,
} from '@shopify/polaris';
import { DatePicker as DatePickerPolaris } from '@shopify/polaris';
import type { IndexFiltersProps, TabProps } from '@shopify/polaris';
import { useState, useCallback, useEffect, useMemo } from 'react';
import type { NextPage } from 'next'
import { Typography } from '@mui/material'
import useSWR from 'swr';
import routes from '@/lib/routes';
import { fetcher, patchRequest } from '@/lib/api';
import Image from 'next/image';
import useSWRMutation from 'swr/mutation';

export interface Product {
    price: number,
    name: string,
    category: string,
    currency: string,
    commission: number,
    commissionType: number,
    _id: string,
    image: string,
    createdAt: Date,
}

export const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

const Product: NextPage = () => {
    const { data, error, isLoading } = useSWR(routes.api.products, fetcher)
    const [sortSelected, setSortSelected] = useState(['product asc']);
    const [queryValue, setQueryValue] = useState('');
    const [selected, setSelected] = useState(0);
    const [selectedCommission, setSelectedCommission] = useState("0");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [itemStrings, setItemStrings] = useState([
        'All',
    ]);
    const { mode, setMode } = useSetIndexFiltersMode();
    const { trigger } = useSWRMutation(`${routes.api.products}/many`, patchRequest)
    const resourceName = {
        singular: 'product',
        plural: 'products',
    };

    const resourceIDResolver = (products: any) => {
        return products._id;
    };

    const { selectedResources, allResourcesSelected, clearSelection, handleSelectionChange } =
        useIndexResourceState(filteredProducts as any, {
            resourceIDResolver,
        });
    const sortOptions: IndexFiltersProps['sortOptions'] = [
        { label: 'Product', value: 'product asc', directionLabel: 'A-Z' },
        { label: 'Product', value: 'product desc', directionLabel: 'Z-A' },
    ];
    const tabs: TabProps[] = itemStrings.map((item, index) => ({
        content: item,
        index,
        onAction: () => { },
        id: `${item}-${index}`,
        isLocked: index === 0,
        actions:
            index === 0
                ? []
                : [
                    {
                        type: 'rename',
                        onAction: () => { },
                        onPrimaryAction: async (value: string): Promise<boolean> => {
                            const newItemsStrings = tabs.map((item, idx) => {
                                if (idx === index) {
                                    return value;
                                }
                                return item.content;
                            });
                            await sleep(1);
                            setItemStrings(newItemsStrings);
                            return true;
                        },
                    },
                    {
                        type: 'edit',
                    },
                ],
    }));
    const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date | undefined, end: Date | undefined }>({ start: undefined, end: undefined });
    const handleDateChange = (range: { start: Date | undefined, end: Date | undefined }) => {
        setSelectedDateRange(range);
    };
    const filters = [
        {
            key: 'Date',
            label: 'Date',
            filter: (
                <DatePicker
                    {...{ handleDateChange }}
                />
            ),
            shortcut: true,
        },
    ];

    const handleFiltersQueryChange = useCallback(
        (value: string) => setQueryValue(value),
        [],
    );
    const handleFiltersClearAll = useCallback(() => {
        handleDateChange({ start: undefined, end: undefined })
    }, []);
    const rowMarkup = useMemo(() => filteredProducts?.slice(0, 10).map(
        (
            { _id: id, image, name, currency, category, commission, price },
            index,
        ) => (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
            >
                <IndexTable.Cell>
                    <Image src={image} alt="image" width={24} height={24} />
                    {name}
                </IndexTable.Cell>
                <IndexTable.Cell>{category}</IndexTable.Cell>
                <IndexTable.Cell>{currency}{price}</IndexTable.Cell>
                <IndexTable.Cell>
                    <Commission {...{ commission, id, index }} />
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    ), [filteredProducts, selectedResources]
    )
    useEffect(() => {
        let filteredProducts = (data as Product[] || [])?.filter(product => {
            const nameMatch = product.name.toLowerCase().includes(queryValue.toLowerCase());
            const priceMatch = queryValue === '' || product.price.toString().includes(queryValue);
            const dateMatch = (!selectedDateRange.start || new Date(product.createdAt) >= selectedDateRange.start) &&
                (!selectedDateRange.end || new Date(product?.createdAt) <= selectedDateRange.end)
            return (nameMatch || priceMatch) && dateMatch;
        });
        if (sortSelected.length) {
            const sortOption = sortSelected[0]
            if (sortOption === 'product asc') {
                filteredProducts = filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sortOption === 'product desc') {
                filteredProducts = filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            }
        }
        setFilteredProducts(filteredProducts || [])
    }, [queryValue, data, selectedDateRange, sortSelected])

    const handleMultipleUpdate = () => trigger({ selectedResources, commission: parseFloat(selectedCommission) }).then(() => {
        clearSelection()
        window.location.reload()
    })

    const breakpoint = useBreakpoints()
    const appliedFilters: IndexFiltersProps['appliedFilters'] = [];
    if (selectedDateRange?.start) {
        appliedFilters.push(
            {
                key: "Date",
                label: `products ${new Date(selectedDateRange.start).toLocaleDateString()}  ${selectedDateRange?.end ?
                    "- " +
                    new Date(selectedDateRange?.end).toLocaleDateString()
                    : ""}
                `,
                onRemove: () => handleDateChange({ start: undefined, end: undefined }),
            }
        )
    }

    return <>
        {(() => {
            if (isLoading) return <>Loading...</>
            if (error) return <>Something went wrong, contact support</>
            else return <Card>
                <IndexFilters
                    onClearAll={handleFiltersClearAll}
                    onQueryChange={handleFiltersQueryChange}
                    onQueryClear={() => setQueryValue('')}
                    onSelect={setSelected}
                    onSort={setSortSelected}
                    {...{
                        appliedFilters,
                        filters, queryValue, setMode, mode, selected,
                        sortOptions, sortSelected, tabs
                    }}
                />
                <IndexTable
                    condensed={breakpoint.smDown}
                    resourceName={resourceName}
                    itemCount={filteredProducts?.length}
                    selectedItemsCount={
                        allResourcesSelected ? 'All' : selectedResources.length
                    }
                    onSelectionChange={handleSelectionChange}
                    headings={[
                        { title: 'name' },
                        { title: 'Category' },
                        { title: 'Price' },
                        { title: 'commission %' },
                    ]}
                >
                    {rowMarkup}
                    {
                        selectedResources.length ? <>
                            <tr>
                                <Typography component={"td"} colSpan={5} sx={{ "& hr": { width: "100%" } }}>
                                    <Divider />
                                    {/* <DatePicker /> */}
                                    <Typography component={"div"} sx={{ p: 2, gap: 2, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <TextField
                                            label=""
                                            type='number'
                                            value={selectedCommission}
                                            onChange={(e) => setSelectedCommission(parseFloat(e).toString())}
                                            autoComplete="off"
                                        />
                                        <Button onClick={handleMultipleUpdate}>Apply to selected products</Button>
                                        <Button onClick={clearSelection}>Clear</Button>
                                    </Typography>
                                </Typography>
                            </tr>
                        </> : <></>
                    }
                </IndexTable>
            </Card>
        })()
        }
    </>

}


const Commission = ({ commission, id }: { commission: number, id: string }) => {
    const { trigger } = useSWRMutation(`${routes.api.products}/${id}`, patchRequest)
    const [value, setValue] = useState(commission?.toString() || '0')
    const handleCommissionChange = (value: string) => {
        setValue(prev => {
            const commission = parseFloat(value)
            if (prev !== commission.toString()) trigger({ commission })
            return commission.toString() || '0'
        })
    }

    return <>
        <Typography component={"div"} sx={{
            justifyContent: "flex-start",
            alignItems: "center", width: "60px"
        }} >
            <TextField
                label=""
                value={value}
                onChange={handleCommissionChange}
                autoComplete="off"
            />
        </Typography>

    </>
}


export const DatePicker = ({ handleDateChange }: { handleDateChange: (date: { start: Date; end: Date; }) => void }) => {
    const currentYear = new Date().getFullYear()
    const [{ month, year }, setDate] = useState({ month: 1, year: currentYear });
    const [selectedDates, setSelectedDates] = useState({
        start: new Date(`Wed Feb 07 ${currentYear} 00:00:00 GMT-0500 (EST)`),
        end: new Date(`Sat Feb 10 ${currentYear} 00:00:00 GMT-0500 (EST)`),
    });

    useEffect(() => {
        handleDateChange(selectedDates)
    }, [handleDateChange, selectedDates]);

    const handleMonthChange = useCallback(
        (month: number, year: number) => setDate({ month, year }),
        [],
    );

    return (
        <DatePickerPolaris
            month={month}
            year={year}
            onChange={setSelectedDates}
            onMonthChange={handleMonthChange}
            selected={selectedDates}
            allowRange
        />
    );
}


export default Product;