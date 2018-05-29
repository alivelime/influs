import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const styles = {
  root: {
		flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
};

function Header(props) {
	const { classes } = props;
	return (
		<div className={classes.root}>
			<AppBar
				position='static'
			>
				<Toolbar>
					<Typography variant="title" color="inherit" className={classes.flex} >
            インフルず
          </Typography>
				</Toolbar>
			</AppBar>
		</div>
	);
}


Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
