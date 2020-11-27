import PropTypes from 'prop-types';
import { Input, Typography, Skeleton } from 'antd';
import shortid from 'shortid';
import { AimOutlined } from '@ant-design/icons';
import PlacesAutocomplete, { getLatLng, geocodeByAddress } from 'react-places-autocomplete';
import { DropDownContainer, ResultItem, Container } from './elements';

const { Text } = Typography;

const PlaceSearchInput = ({ value, onChange, onSelect, placeholder, ...props }) => {
  const handleSelect = async (result) => {
    const address = await geocodeByAddress(result);
    const latLng = await getLatLng(address[0]);

    onSelect({
      result,
      address,
      ...latLng,
    });
  };

  return (
    <PlacesAutocomplete value={value} onChange={onChange} onSelect={handleSelect}>
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
        return (
          <Container>
            <Input
              prefix={<AimOutlined />}
              {...props}
              {...getInputProps({
                placeholder,
              })}
              // Done according to this issue suggestion:
              // https://github.com/ant-design/ant-design/issues/15875
              // since autoComplete off is not working in Chrome
              autoComplete="newpassword"
            />
            <DropDownContainer hidden={!loading && suggestions.length === 0}>
              {loading
                ? new Array(5).fill().map(() => (
                    <ResultItem key={shortid.generate()}>
                      <Skeleton
                        title={{ width: 100 }}
                        paragraph={{ rows: 1, width: 200 }}
                        active
                        loading
                      />
                    </ResultItem>
                  ))
                : suggestions.map((suggestion) => (
                    <ResultItem
                      active={suggestion.active}
                      {...getSuggestionItemProps(suggestion)}
                      key={shortid.generate()}
                    >
                      <Text className="title">{suggestion.formattedSuggestion.mainText}</Text>
                      <br />
                      <Text type="secondary">{suggestion.formattedSuggestion.secondaryText}</Text>
                    </ResultItem>
                  ))}
            </DropDownContainer>
          </Container>
        );
      }}
    </PlacesAutocomplete>
  );
};

PlaceSearchInput.defaultProps = {
  value: '',
  placeholder: '',
  label: '',
};

PlaceSearchInput.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default PlaceSearchInput;
