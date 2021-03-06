import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import Link from 'modules/components/Link';

const styleSheet = theme => ({
	image: {
		minWidth: 80,
		maxHeight: 80,
		objectFit: 'cover',
	},
	card: {
		display: 'flex',
		padding: theme.spacing.unit * 2,
		width: '100%',
		backgroundColor: 'inherit',
	},
	content: {
		padding: 0,
		paddingLeft: theme.spacing.unit * 2,
	},
  cardAction: {
    display: 'block',
    textAlign: 'initial',
		margin: 0,
		padding: 0,
		flex: 1,
  },
});

class Recommend extends React.Component {

	render() {
		const { classes } = this.props;

		if (!this.props.data || !this.props.data.title || this.props.data.title.length === 0) {
			return null;
		}

		let description = null;
		if (this.props.data.description) {
			description = this.props.data.description.split("\n").map(str => {
				return (<span>{str}</span>)
			})[0];
		}

		if (this.props.enableLink) {
			return (
				<Card className={classes.card}>
					<CardMedia
						className={classes.image}
						image={this.props.data.image}
						title={this.props.data.title}
					/>
					<CardContent className={classes.content}>
						<div>
							<Link to={this.props.data.link}>
								<Typography variant="title">{this.props.data.title}</Typography>
							</Link>
						</div>
						<Typography variant="body1">{description}</Typography>
					</CardContent>
					<ButtonBase
						className={classes.cardAction}
						onClick={this.props.handleCollapse}
					/>
				</Card>
			);
		} else {
			return (
				<Card className={classes.card}>
					<CardMedia
						className={classes.image}
						image={this.props.data.image}
						title={this.props.data.title}
					/>
					<CardContent className={classes.content}>
						<Typography variant="title">{this.props.data.title}</Typography>
						<Typography variant="body1">{description}</Typography>
					</CardContent>
				</Card>
			);
		}
	}
}

Recommend.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(Recommend);

