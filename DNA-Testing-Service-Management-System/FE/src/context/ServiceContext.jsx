import { createContext, useContext } from "react";

export const ServiceContext = createContext([]);

export const useServiceContext = () => useContext(ServiceContext);
