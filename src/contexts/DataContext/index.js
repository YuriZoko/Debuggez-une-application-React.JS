import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [lastEvent, setLastEvent] = useState(null);

  const getData = useCallback(async () => {
    try {
      const loadedData = await api.loadData();
      setData(loadedData);
      if (loadedData && loadedData.events && loadedData.events.length > 0) {
        const latestEvent = loadedData.events.reduce((latest, current) => {
          const latestDate = new Date(latest.date);
          const currentDate = new Date(current.date);
          return currentDate > latestDate ? current : latest;
        });
        setLastEvent(latestEvent);
      }
    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);
  
  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        lastEvent,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;
