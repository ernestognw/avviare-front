import PropTypes from 'prop-types';
import { MarkerContainer } from './elements';

const Marker = ({ lat, lng, children }) => (
  <MarkerContainer lat={lat} lng={lng}>
    {children}
  </MarkerContainer>
);

Marker.defaultProps = {
  children: undefined,
};

Marker.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  children: PropTypes.node,
};

export default Marker;
