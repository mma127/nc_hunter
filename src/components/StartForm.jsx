import {Box, Button, Card, Container, TextField} from "@mui/material"
import {Controller, useForm} from "react-hook-form"
import * as yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup";

import {useGrid, useGridDispatch} from "../GridContext"
import {makeStyles} from "@mui/styles";
import {TrackingResult} from "../models/TrackingResult";
import {addInitialResult} from "../state/gridActions";

const useStyles = makeStyles(() => ({
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  row: {
    display: 'flex',
    justifyContent: "center"
  },
  coordWrapper: {
    margin: "0.5rem"
  },
  namesInput: {
    width: "24rem"
  }
}))

const schema = yup.object().shape({
  x: yup.number().typeError("Must be a number").required("Required").positive().integer().max(100),
  y: yup.number().typeError("Must be a number").required("Required").positive().integer().max(100),
  revealed: yup.string()
})

export const StartForm = () => {
  const classes = useStyles();
  const dispatch = useGridDispatch()

  const {reset, handleSubmit, control, formState: {errors}} = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = data => {
    const parsedNames = data.revealed.split(',').map(str => str.trim());
    const trackingResult = new TrackingResult(data.x, data.y, parsedNames)
    dispatch(addInitialResult(trackingResult))
  }

  return (
    <Container maxWidth="md">
      <Box className={classes.container}>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box className={classes.row}>
              <Box className={classes.coordWrapper}>
                <Controller
                  name="x" control={control} defaultValue=""
                  render={({field}) => (<TextField
                    variant="standard"
                    label="Starting X coordinate"
                    error={Boolean(errors.x)}
                    helperText={errors.x?.message}
                    {...field}
                  />)}
                />
              </Box>
              <Box className={classes.coordWrapper}>
                <Controller
                  name="y" control={control} defaultValue=""
                  render={({field}) => (<TextField
                    variant="standard"
                    label="Starting Y coordinate"
                    error={Boolean(errors.y)}
                    helperText={errors.y?.message}
                    {...field}
                  />)}
                />
              </Box>
            </Box>
            <Box className={classes.row}>
              <Controller
                name="revealed" control={control} defaultValue=""
                render={({field}) => (<TextField
                  variant="standard"
                  label="Revealed names, comma separated"
                  error={Boolean(errors.revealed)}
                  helperText={errors.revealed?.message}
                  className={classes.namesInput}
                  {...field}
                />)}
              />
            </Box>
            <Button type="submit">Submit</Button>
          </form>
        </Card>
      </Box>
    </Container>
  )
}
