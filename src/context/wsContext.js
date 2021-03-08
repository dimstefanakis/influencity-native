import React from 'react';

// the data key is used for chatting, we should rename it later on
export const WsContext = React.createContext({data: [], notificationData: []});
