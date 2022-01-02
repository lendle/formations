import Typography from "@material-ui/core/Typography"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import { makeStyles } from "@material-ui/core/styles"
import React, { ReactNode, useContext } from "react"
import PanelContext from "./PanelContext"
import { Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core"

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
    margin: theme.spacing(),
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
  const handleChange = (_event: React.ChangeEvent<unknown>, isExpanded: boolean) => {
    setExpanded(isExpanded ? name : "")
  }

  return (
    <Accordion expanded={expanded === name} onChange={handleChange} square>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>{heading1}</Typography>
        <Typography className={classes.secondaryHeading}>{heading2}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <form className={classes.form} autoComplete="off">
          {children}
        </form>
      </AccordionDetails>
    </Accordion>
  )
}

export default SettingsPanel
