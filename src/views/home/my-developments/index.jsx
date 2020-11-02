import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@apollo/client';
import { Typography, Input, Select, Spin, Pagination } from 'antd';
import { orders } from '@config/constants';
import { useUser } from '@providers/user';
import { LoadingOutlined } from '@ant-design/icons';
import { sortableFields } from '@config/constants/development';
import DevelopmentCard from '@components/development-card';
import { Container, TitleSection, DevelopmentsContainer } from './elements';
import { GET_MY_DEVELOPMENTS } from './requests';

const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const defaultSortBy = {
  field: 'startDate',
  order: 'asc',
};

const MyDevelopments = () => {
  const [search, setSearch] = useState();
  const [params, setParams] = useState(defaultParams);
  const [sortBy, setSortBy] = useState(defaultSortBy);
  const [debouncedSearch] = useDebounce(search, 500);

  const { user } = useUser();

  const { data, loading } = useQuery(GET_MY_DEVELOPMENTS, {
    variables: {
      sortBy,
      params,
      userId: user.id,
      search: {
        name: debouncedSearch,
      },
    },
  });

  return (
    <Container>
      <TitleSection>
        <Title style={{ marginRight: 'auto' }} level={3}>
          Mis Desarrollos
        </Title>
        <div>
          <Paragraph style={{ margin: 0 }} type="secondary">
            Buscar desarrollo
          </Paragraph>
          <Search
            style={{ width: 250, marginRight: 10 }}
            allowClear
            placeholder="Buscar"
            onChange={({ target: { value } }) => setSearch(value)}
          />
        </div>
        <div>
          <Paragraph style={{ margin: 0 }} type="secondary">
            Ordenar por
          </Paragraph>
          <Select
            style={{ marginRight: 10 }}
            defaultValue={defaultSortBy.field}
            placeholder="Ordenar por"
            onChange={(value) => setSortBy({ ...sortBy, field: value })}
          >
            {Object.keys(sortableFields).map((field) => (
              <Option key={field} value={field}>
                {sortableFields[field]}
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <Paragraph style={{ margin: 0 }} type="secondary">
            Orden
          </Paragraph>
          <Select
            defaultValue={defaultSortBy.order}
            placeholder="Orden"
            onChange={(value) => setSortBy({ ...sortBy, order: value })}
          >
            {Object.keys(orders).map((order) => (
              <Option key={order} value={order}>
                {orders[order]}
              </Option>
            ))}
          </Select>
        </div>
      </TitleSection>
      {loading ? (
        <div
          style={{ display: 'flex', margin: 40, justifyContent: 'center', alignItems: 'center' }}
        >
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      ) : (
        <>
          <DevelopmentsContainer>
            {data?.developments.results.map((development) => (
              <DevelopmentCard key={development.id} {...development} />
            ))}
          </DevelopmentsContainer>
          <Pagination
            style={{ textAlign: 'center', marginTop: 20 }}
            current={params.page}
            defaultCurrent={defaultParams.page}
            pageSize={params.pageSize}
            defaultPageSize={defaultParams.pageSize}
            total={data?.developments.info.count}
            showTotal={(total) => `${total} desarrollos`}
            showSizeChanger
            onChange={(page, pageSize) => setParams({ ...params, page, pageSize })}
            onShowSizeChange={(page, pageSize) => setParams({ ...params, page, pageSize })}
          />
        </>
      )}
    </Container>
  );
};

export default MyDevelopments;
