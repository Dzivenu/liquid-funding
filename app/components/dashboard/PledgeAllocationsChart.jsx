import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { Doughnut } from 'react-chartjs-2'
import { FundingContext } from '../../context'
import { toEther } from '../../utils/conversions'
import { getTokenLabel } from '../../utils/currencies'
import { getColor } from '../../utils/colorSchemes'

const styles = {
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}

const pledgesChartData = pledges => {
  const data = []
  const labels = []
  const backgroundColor = []
  pledges.forEach((pledge, idx) => {
    const { id, amount, token } = pledge
    const converted = toEther(amount)
    data.push(converted)
    labels.push(
      `pledge ${id} - ${getTokenLabel(token)}`
    )
    backgroundColor.push(getColor('Dark2-8', idx))
  })
  return {
    datasets: [
      {
        data,
        backgroundColor,
        hoverBackgroundColor: backgroundColor
      }
    ],
    labels
  }
}

function SimpleCard(props) {
  const { classes, title } = props

  return (
    <FundingContext.Consumer>
      {({ allPledges }) =>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {title}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              How your funds are distributed among pledges
            </Typography>
            <Doughnut data={pledgesChartData(allPledges)} />
          </CardContent>
        </Card>
      }
    </FundingContext.Consumer>
  )
}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string
}

export default withStyles(styles)(SimpleCard)