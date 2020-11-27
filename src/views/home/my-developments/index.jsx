import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@apollo/client';
import { Typography } from 'antd';
import { useUser } from '@providers/user';
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

const MyDevelopments = () => {
  const [search, setSearch] = useState('');
  const [params, setParams] = useState(defaultParams);
  const [sortBy, setSortBy] = useState(defaultSortBy);
  const [debouncedSearch] = useDebounce(search, 500);

  const { user } = useUser();

  const { data, loading } = useQuery(GET_MY_DEVELOPMENTS, {
    variables: {
      sortBy,
      params,
      user: {
        in: [user.id],
      },
      search: {
        name: debouncedSearch,
      },
    },
  });

  return (
    <DevelopmentsGrid
      title="Mis Desarrollos"
      empty={{
        description: (
          <>
            <Text strong>No hay resultados</Text>
            <br />
            <Text>
              Si aún no trabajas para ningún desarrollo, solicita al administrador que te asigne a
              alguno
            </Text>
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

export default MyDevelopments;
