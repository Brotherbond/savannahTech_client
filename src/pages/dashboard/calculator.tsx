import React from 'react';
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
} from '@shopify/polaris';
import {
    ToggleOnIcon,
    ToggleOffIcon
} from '@shopify/polaris-icons';

import type { IndexFiltersProps, TabProps } from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';
import type { NextPage } from 'next'
import Layout from '@/layouts/Dashboard'
import { Container, Unstable_Grid2 as Grid, Typography } from '@mui/material'
import useSWR from 'swr';
import routes from '@/lib/routes';
import { fetcher, sendRequest } from '@/lib/api';
import Image from 'next/image';
import useSWRMutation from 'swr/mutation';

interface Product {
    price: number,
    name: string,
    category: string,
    currency: string,
    commission: number,
    commissionType: number,
    id: string,
    image: string,
}

const Calculator: NextPage = () => {
    const { data, error, isLoading } = useSWR(routes.api.products, fetcher)
    const { trigger } = useSWRMutation(routes.api.products, sendRequest)

    const [products, setProducts] = useState<Product[]>([])
    useEffect(() => {
        (data as [])?.length && setProducts(data as [])
    }, [data])

    const resourceName = {
        singular: 'product',
        plural: 'products',
    };

    const handleCommissionChange = (id: string) => {

    }

    const toggleCommissionType = (i: number) => {
        setProducts((prev: Product[]) => {
            const products = [...prev]
            products[i].commissionType = (products[i].commissionType + 1) % 2
            return products
        })
    }


    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(products as any);

    const rowMarkup = products.map(
        (
            { id, image, name, currency, category, commission, commissionType, price },
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
                    <Typography sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} >
                        {/* <span onClick={() => toggleCommissionType(index)}>
                            {commissionType ?
                                <Icon
                                    source={ToggleOffIcon}
                                    tone="base"
                                />
                                :
                                <Icon
                                    source={ToggleOnIcon}
                                    tone="base"
                                />
                            }
                        </span> */}
                        <TextField
                            label=""
                            value={commission.toString()}
                            onChange={() => handleCommissionChange(id)}
                            autoComplete="off"
                        />
                    </Typography>
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    const sortOptions: IndexFiltersProps['sortOptions'] = [
        { label: 'Order', value: 'order asc', directionLabel: 'Ascending' },
        { label: 'Order', value: 'order desc', directionLabel: 'Descending' },
        { label: 'Customer', value: 'customer asc', directionLabel: 'A-Z' },
        { label: 'Customer', value: 'customer desc', directionLabel: 'Z-A' },
        { label: 'Date', value: 'date asc', directionLabel: 'A-Z' },
        { label: 'Date', value: 'date desc', directionLabel: 'Z-A' },
        { label: 'Total', value: 'total asc', directionLabel: 'Ascending' },
        { label: 'Total', value: 'total desc', directionLabel: 'Descending' },
    ];
    const [sortSelected, setSortSelected] = useState(['order asc']);
    const [queryValue, setQueryValue] = useState('');
    const [selected, setSelected] = useState(0);
    const [itemStrings, setItemStrings] = useState([
        'All',
    ]);
    const { mode, setMode } = useSetIndexFiltersMode();

    const handleFiltersQueryChange = useCallback(
        (value: string) => setQueryValue(value),
        [],
    );
    const handleFiltersClearAll = useCallback(() => {
        // handleAccountStatusRemove();
        // handleMoneySpentRemove();
        // handleTaggedWithRemove();
        // handleQueryValueRemove();
    }, [
        // handleAccountStatusRemove,
        // handleMoneySpentRemove,
        // handleQueryValueRemove,
        // handleTaggedWithRemove,
    ]);

    const sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
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
    return <Layout title="Calculator">
        {(() => {
            if (isLoading) return <>Loading...</>
            if (error) return <>Something went wrong, contact support</>
            else return <Card>
                <IndexFilters
                    sortOptions={sortOptions}
                    sortSelected={sortSelected}
                    onQueryChange={handleFiltersQueryChange}
                    onQueryClear={() => setQueryValue('')}
                    mode={mode}
                    setMode={setMode}
                    tabs={tabs}
                    selected={selected}
                    filters={filters}
                    onClearAll={handleFiltersClearAll}
                />
                <IndexTable
                    condensed={breakpoint.smDown}
                    resourceName={resourceName}
                    itemCount={products.length}
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


export default Calculator;