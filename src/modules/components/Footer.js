import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from 'modules/components/Link';

const styleSheet = theme => ({
  root: {
    maxWidth: theme.spacing.unit * 110,
    margin: 'auto',
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2}px`,
    [theme.breakpoints.up('sm')]: {
      padding: `${theme.spacing.unit * 6}px ${theme.spacing.unit * 2}px`,
    },
  },
	hero: {
    flex: '0 0 auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
		backgroundColor: theme.palette.secondary[50],
    color: theme.palette.type === 'light' ? theme.palette.primary.dark : theme.palette.primary.main,
	},
  list: {
    margin: 0,
    paddingLeft: 0,
    listStyle: 'none',
  },
  listItem: {
    paddingTop: theme.spacing.unit / 2,
    paddingBottom: theme.spacing.unit / 2,
  },
  version: {
    marginTop: theme.spacing.unit,
  },
});

function Footer(props) {
  const { classes } = props;

  return (
		<div className={classes.hero}>
    <footer className={classes.root}>
			<Typography variant="title">
				あなたの「イイね」で繋がろう! インフルず
			</Typography>
      <Typography variant="subheading" component="div">
        <Grid container>
          <Grid item xs={12} sm={6}>
            <ul className={classes.list}>
              <li className={classes.listItem}>
                <Link to="https://github.com/alivelime/influs">GitHub</Link>
              </li>
              <li className={classes.listItem}>
                <Link to="https://twitter.com/alivelime">Twitter</Link>
              </li>
              <li className={classes.listItem}>
                <Link to="/vision">
									Vision
                </Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={12} sm={6}>
            <ul className={classes.list}>
              <li className={classes.listItem}>
                <Link to="/contact">Contact us</Link>
              </li>
              <li className={classes.listItem}>
                <Link to="/roadmap">Roadmap</Link>
              </li>
              <li className={classes.listItem}>
                <Link to="/">Team</Link>
              </li>
            </ul>
          </Grid>
        </Grid>
      </Typography>
      <Typography className={classes.version} gutterBottom noWrap>
        Copyrights 
				<Link to="https://tokishirazu.co.jp">ときしらず LLC</Link>
      </Typography>
    </footer>
		</div>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(Footer);
