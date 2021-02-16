import { useState } from 'react';
import { parse, stringify } from 'qs';
import { useLocation, useHistory } from 'react-router-dom';

const useQueryParam = (key, initialValue) => {
  const { search, pathname } = useLocation();
  const { replace } = useHistory();

  const [queryParam, setQueryParam] = useState(parse(search.substring(1))[key] ?? initialValue);

  const setBindedQueryParam = (newValue) => {
    const mergedNewValue = {
      ...parse(search.substring(1)),
    };

    if (newValue) mergedNewValue[key] = newValue;
    else delete mergedNewValue[key]; // Remove param when no value

    const newSearch = stringify(mergedNewValue);
    replace(`${pathname}?${newSearch}`);
    setQueryParam(newValue);
  };

  return [queryParam, setBindedQueryParam];
};

export default useQueryParam;
