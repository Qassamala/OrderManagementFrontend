import React from 'react';

const defaultValue = {customerId: null, customers: []} //Insert the default value here.
export const MyContext = React.createContext(defaultValue);

export default MyContext