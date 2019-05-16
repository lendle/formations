import ExpansionPanel from "@material-ui/core/ExpansionPanel"
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails"
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary"
import Typography from "@material-ui/core/Typography"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import { makeStyles } from "@material-ui/styles"
import React, { ReactNode, useContext } from "react"
import PanelContext from "./PanelContext"

const useStyles = makeStyles(theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "50%",
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  form: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 180
  }
}))

type Props = {
  name: string;
  heading1: string;
  heading2: string;
  children?: ReactNode;
}
const SettingsPanel = (props: Props) => {
  const classes = useStyles()
  const { name, children, heading1, heading2 } = props
  const { expanded, setExpanded } = useContext(PanelContext)
  const handleChange = (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? name : "")
  }

  return (
    <ExpansionPanel expanded={expanded === name} onChange={handleChange} square>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>{heading1}</Typography>
        <Typography className={classes.secondaryHeading}>{heading2}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <form className={classes.form} autoComplete="off">
          {children}
        </form>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default SettingsPanel
