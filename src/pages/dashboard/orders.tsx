import {
    TextField,
    IndexTable,
    Card,
    IndexFilters,
    useSetIndexFiltersMode,
    useIndexResourceState,
    useBreakpoints,
} from '@shopify/polaris';
import type { IndexFiltersProps, TabProps } from '@shopify/polaris';
import { useState, useCallback, useEffect, useMemo } from 'react';
import type { NextPage } from 'next'
import Layout from '@/layouts/Dashboard'
import useSWR from 'swr';
import routes from '@/lib/routes';
import { fetcher } from '@/lib/api';
import Image from 'next/image';
import { Product, sleep } from './products';


const Order: NextPage = () => {
    const { data, error, isLoading } = useSWR(routes.api.orders, fetcher)
    const [orders, setProducts] = useState<Product[]>([])
    useEffect(() => {
        (data as [])?.length && setProducts(data as [])
    }, [data])

    const resourceName = {
        singular: 'order',
        plural: 'orders',
    };

    const resourceIDResolver = (orders: any) => {
        return orders._id;
    };

    const { selectedResources, allResourcesSelected, clearSelection, handleSelectionChange } =
        useIndexResourceState(orders as any, {
            resourceIDResolver,
        });

    const rowMarkup = useMemo(() => [...orders].slice(0, 10).map(
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
                <IndexTable.Cell>{commission}</IndexTable.Cell>
            </IndexTable.Row>
        ),
    ), [orders, selectedResources]
    )

    const sortOptions: IndexFiltersProps['sortOptions'] = [
        { label: 'Order', value: 'order asc', directionLabel: 'Ascending' },
        { label: 'Order', value: 'order desc', directionLabel: 'Descending' },
        { label: 'Price', value: 'order asc', directionLabel: 'Ascending' },
        { label: 'Price', value: 'order desc', directionLabel: 'Descending' },
        { label: 'Customer', value: 'customer asc', directionLabel: 'A-Z' },
        { label: 'Customer', value: 'customer desc', directionLabel: 'Z-A' },
        { label: 'Date', value: 'date asc', directionLabel: 'A-Z' },
        { label: 'Date', value: 'date desc', directionLabel: 'Z-A' },
    ];
    const [sortSelected, setSortSelected] = useState(['order asc']);
    const [queryValue, setQueryValue] = useState('');
    const [selected, setSelected] = useState(0);
    const [selectedCommission, setSelectedCommission] = useState("0");
    const [itemStrings, setItemStrings] = useState([
        'All',
    ]);
    const { mode, setMode } = useSetIndexFiltersMode();

    const handleFiltersQueryChange = useCallback(
        (value: string) => setQueryValue(value),
        [],
    );
    const handleFiltersClearAll = useCallback(() => {
    }, []);

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

    const breakpoint = useBreakpoints()
    return <Layout title="Orders">
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
                    itemCount={orders.length}
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
                </IndexTable>
            </Card>
        })()
        }
    </Layout>

}

export default Order;