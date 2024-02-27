import {
    TextField,
    IndexTable,
    Card,
    IndexFilters,
    useSetIndexFiltersMode,
    useIndexResourceState,
    Text,
    useBreakpoints,
    Icon,
    Divider,
    Button,
} from '@shopify/polaris';
import { DatePicker as DatePickerPolaris } from '@shopify/polaris';
import {
    ToggleOnIcon,
    ToggleOffIcon
} from '@shopify/polaris-icons';

import type { IndexFiltersProps, TabProps } from '@shopify/polaris';
import { useState, useCallback, useEffect, useMemo } from 'react';
import type { NextPage } from 'next'
import Layout from '@/layouts/Dashboard'
import { Typography } from '@mui/material'
import useSWR, { mutate } from 'swr';
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
}

export const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

const Product: NextPage = () => {
    const { data, error, isLoading } = useSWR(routes.api.products, fetcher)
    const [sortSelected, setSortSelected] = useState(['order asc']);
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
        { label: 'Order', value: 'order asc', directionLabel: 'Ascending' },
        { label: 'Order', value: 'order desc', directionLabel: 'Descending' },
        { label: 'Price', value: 'price asc', directionLabel: 'Ascending' },
        { label: 'Price', value: 'price desc', directionLabel: 'Descending' },
        { label: 'Customer', value: 'customer asc', directionLabel: 'A-Z' },
        { label: 'Customer', value: 'customer desc', directionLabel: 'Z-A' },
        { label: 'Date', value: 'date asc', directionLabel: 'A-Z' },
        { label: 'Date', value: 'date desc', directionLabel: 'Z-A' },
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

    const filters = [
        {
            key: 'taggedWith',
            label: 'Tagged with',
            filter: (
                <TextField
                    label="Tagged with"
                    // value={taggedWith}
                    // onChange={handleTaggedWithChange}
                    autoComplete="off"
                    labelHidden
                />
            ),
            shortcut: true,
        },
    ];


    const handleFiltersQueryChange = useCallback(
        (value: string) => setQueryValue(value),
        [],
    );
    const handleFiltersClearAll = useCallback(() => { }, []);
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
        const filteredProducts = (data as Product[])?.filter(product => {
            const nameMatch = product.name.toLowerCase().includes(queryValue.toLowerCase());
            const priceMatch = queryValue === '' || product.price.toString().includes(queryValue);
            return nameMatch || priceMatch;
        });
        setFilteredProducts(filteredProducts || [])
    }, [queryValue, data])

    const handleMultipleUpdate = () => trigger({ selectedResources, commission: parseFloat(selectedCommission) }).then(() => {
        clearSelection()
        mutate(routes.api.products);
        window.location.reload()
    })

    const breakpoint = useBreakpoints()
    return <Layout title="Product">
        {(() => {
            if (isLoading) return <>Loading...</>
            if (error) return <>Something went wrong, contact support</>
            else return <Card>
                <IndexFilters
                    sortOptions={sortOptions}
                    sortSelected={sortSelected}
                    onSort={setSortSelected}
                    queryValue={queryValue}
                    onQueryChange={handleFiltersQueryChange}
                    onQueryClear={() => setQueryValue('')}
                    mode={mode}
                    setMode={setMode}
                    tabs={tabs}
                    selected={selected}
                    onSelect={e => { setSelected }}
                    filters={filters}
                    onClearAll={handleFiltersClearAll}
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
    </Layout>

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


export const DatePicker = () => {
    const [{ month, year }, setDate] = useState({ month: 1, year: 2018 });
    const [selectedDates, setSelectedDates] = useState({
        start: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
        end: new Date('Sat Feb 10 2018 00:00:00 GMT-0500 (EST)'),
    });

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