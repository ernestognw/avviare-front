import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@apollo/client';
import { Typography } from 'antd';
import DevelopmentsGrid from '@components/developments-grid';
import { GET_MY_DEVELOPMENTS } from './requests';

const { Text } = Typography;

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const defaultSortBy = {
  field: 'startDate',
  order: 'asc',
};

const AllDevelopments = () => {
  const [search, setSearch] = useState('');
  const [params, setParams] = useState(defaultParams);
  const [sortBy, setSortBy] = useState(defaultSortBy);
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, loading } = useQuery(GET_MY_DEVELOPMENTS, {
    variables: {
      sortBy,
      params,
      search: {
        name: debouncedSearch,
      },
    },
  });

  return (
    <DevelopmentsGrid
      title="Todos los desarrollos"
      empty={{
        description: (
          <>
            <Text strong>No hay resultados</Text>
            <br />
            <Text>Cambia tus parámetros de búsqueda</Text>
          </>
        ),
      }}
      params={params}
      setParams={setParams}
      defaultParams={defaultParams}
      search={search}
      setSearch={setSearch}
      sortBy={sortBy}
      setSortBy={setSortBy}
      defaultSortBy={defaultSortBy}
      loading={loading}
      developments={data?.developments}
    />
  );
};

export default AllDevelopments;
