import React from 'react';
import PropTypes from 'prop-types';
import theme from '@config/theme';
import GoogleMapReact from 'google-map-react';
import { google } from '@config/environment';
import Box from '@components/box';
import Marker from './marker';

const Map = ({
  center,
  zoom,
  children,
  defaultCenter,
  defaultZoom,
  onGoogleApiLoaded,
  ...props
}) => (
  <Box {...props}>
    <GoogleMapReact
      onGoogleApiLoaded={onGoogleApiLoaded}
      bootstrapURLKeys={{ key: google.mapsApiKey, libraries: 'places' }}
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
      center={center}
      zoom={zoom}
      yesIWantToUseGoogleMapApiInternals
      options={{
        styles: [
          {
            stylers: [
              {
                hue: theme.colors.primary,
              },
            ],
          },
          {
            featureType: 'water',
            stylers: [
              {
                color: '#ffffff',
              },
            ],
          },
        ],
      }}
    >
      {children}
    </GoogleMapReact>
  </Box>
);

const defaultZoom = 13;
const defaultCenter = {
  lat: 25.651434, // Default Lat for Tec de Monterrey
  lng: -100.2938946, // Default Lng for Tec de Monterrey
};

Map.defaultProps = {
  height: 400,
  width: '100%',
  zoom: defaultZoom,
  center: defaultCenter,
  defaultCenter,
  children: undefined,
  defaultZoom,
  onGoogleApiLoaded: () => {},
};

Map.propTypes = {
  center: PropTypes.object,
  defaultCenter: PropTypes.object,
  zoom: PropTypes.number,
  defaultZoom: PropTypes.number,
  children: PropTypes.any,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onGoogleApiLoaded: PropTypes.func,
  ...Box.propTypes,
};

export { Marker };
export default Map;
