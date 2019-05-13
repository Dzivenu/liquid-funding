import React from 'react';
import {render} from 'react-dom';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import database from './db';
import App from './dapp';

import './css/fonts/Inter/inter.css'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: ['Inter', '-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Roboto', "Helvetica Neue", 'Arial', "Noto Sans", 'sans-serif', "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"].join(','),
  },
  palette: {
    common: {
      grey: '#F5F7F8'
    },
    text: {
      grey: '#939BA1'
    }
  }
});

render(
  <DatabaseProvider database={database}>
    <MuiThemeProvider theme={theme}>
      <App/>
    </MuiThemeProvider>
  </DatabaseProvider>, document.getElementById('app')
);