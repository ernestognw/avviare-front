import PropTypes from 'prop-types';
import { Typography, Input, Select, Pagination, Radio, Empty } from 'antd';
import { orders } from '@config/constants';
import { sortableFields } from '@config/constants/development';
import DevelopmentCard from '@components/development-card';
import Loading from '@components/loading';
import Box from '@components/box';
import {
  Container,
  TitleSection,
  DevelopmentsContainer,
  EmptyAndLoaderContainer,
} from './elements';

const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const DevelopmentsGrid = ({
  title,
  empty,
  params,
  setParams,
  defaultParams,
  search,
  setSearch,
  sortBy,
  setSortBy,
  defaultSortBy,
  loading,
  developments,
}) => {
  return (
    <Container>
      <TitleSection>
        <Title style={{ marginRight: 'auto' }} level={3}>
          {title}
        </Title>
        <Box>
          <Paragraph style={{ margin: 0 }} type="secondary">
            Buscar desarrollo
          </Paragraph>
          <Search
            style={{ width: 250, marginRight: 10 }}
            allowClear
            placeholder="Buscar"
            value={search}
            onChange={({ target: { value } }) => setSearch(value)}
          />
        </Box>
        <Box>
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
        </Box>
        <Box>
          <Paragraph style={{ margin: 0 }} type="secondary">
            Orden
          </Paragraph>
          <Radio.Group
            optionType="button"
            options={Object.keys(orders).map((order) => ({ label: orders[order], value: order }))}
            onChange={({ target: { value } }) => setSortBy({ ...sortBy, order: value })}
            defaultValue={defaultSortBy.order}
          />
        </Box>
      </TitleSection>
      {loading ? (
        <EmptyAndLoaderContainer>
          <Loading />
        </EmptyAndLoaderContainer>
      ) : developments.results.length === 0 ? (
        <EmptyAndLoaderContainer>
          <Empty {...empty} />
        </EmptyAndLoaderContainer>
      ) : (
        <>
          <DevelopmentsContainer>
            {developments.results.map((development) => (
              <DevelopmentCard key={development.id} {...development} />
            ))}
          </DevelopmentsContainer>
          <Pagination
            style={{ textAlign: 'center', marginTop: 20 }}
            current={params.page}
            defaultCurrent={defaultParams.page}
            pageSize={params.pageSize}
            defaultPageSize={defaultParams.pageSize}
            total={developments.info.count}
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

const paramsPropTypes = PropTypes.shape({
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
});

const sortByPropTypes = PropTypes.shape({
  field: PropTypes.oneOf(Object.keys(sortableFields)).isRequired,
  order: PropTypes.oneOf(Object.keys(orders)).isRequired,
});

DevelopmentsGrid.defaultProps = {
  empty: {},
  developments: {
    results: [],
    info: {
      count: 0,
    },
  },
};

DevelopmentsGrid.propTypes = {
  title: PropTypes.string.isRequired,
  empty: PropTypes.object,
  params: paramsPropTypes.isRequired,
  setParams: PropTypes.func.isRequired,
  defaultParams: paramsPropTypes.isRequired,
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  sortBy: sortByPropTypes.isRequired,
  setSortBy: PropTypes.func.isRequired,
  defaultSortBy: sortByPropTypes.isRequired,
  loading: PropTypes.bool.isRequired,
  developments: PropTypes.shape({
    // developments type checking is handled by development card
    results: PropTypes.arrayOf(PropTypes.object),
    info: PropTypes.shape({
      count: PropTypes.number.isRequired,
    }),
  }),
};

export default DevelopmentsGrid;
