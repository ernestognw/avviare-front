import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@apollo/client';
import { Typography } from 'antd';
import { useProfile } from '@providers/profile';
import DevelopmentsGrid from '@components/developments-grid';
import { GET_DEVELOPMENTS } from './requests';

const { Text } = Typography;

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const defaultSortBy = {
  field: 'startDate',
  order: 'asc',
};

const ProfileDevelopments = () => {
  const [search, setSearch] = useState('');
  const [params, setParams] = useState(defaultParams);
  const [sortBy, setSortBy] = useState(defaultSortBy);
  const [debouncedSearch] = useDebounce(search, 500);

  const { profile } = useProfile();

  const { data, loading } = useQuery(GET_DEVELOPMENTS, {
    variables: {
      sortBy,
      params,
      user: {
        eq: profile.id,
      },
      search: {
        name: debouncedSearch,
      },
    },
  });

  return (
    <DevelopmentsGrid
      title={`Desarrollos de ${profile.firstName}`}
      empty={{
        description: <Text strong>No hay resultados</Text>,
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

export default ProfileDevelopments;
