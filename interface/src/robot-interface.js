import AppBar from "@material-ui/core/AppBar";
import Chip from "@material-ui/core/Chip";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Slider from "@material-ui/core/Slider";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import CompassIcon from "@material-ui/icons/AllOut";
import ExploreIcon from "@material-ui/icons/Explore";
import SpeedIcon from "@material-ui/icons/Speed";
import RobotIcon from "@material-ui/icons/Camera";
import MotionIcon from "@material-ui/icons/ControlCamera";
import ThreeIcon from "@material-ui/icons/Looks3";
import FourIcon from "@material-ui/icons/Looks4";
import OneIcon from "@material-ui/icons/LooksOne";
import TwoIcon from "@material-ui/icons/LooksTwo";
import ManualIcon from "@material-ui/icons/PanTool";
import HorizIcon from "@material-ui/icons/SwapHoriz";
import VertIcon from "@material-ui/icons/SwapVert";
import ThreeDRotationIcon from "@material-ui/icons/ThreeDRotation";
import HighlightIcon from "@material-ui/icons/Highlight";

import React from "react";

const thrustmarks = [
  {
    value: 50,
    label: "Slow"
  },
  {
    value: 100,
    label: "Forward"
  },
  {
    value: 0,
    label: "Stop"
  },
  {
    value: -50,
    label: "Back-up"
  },
  {
    value: -100,
    label: "Reverse"
  }
];

const diffmarks = [
  {
    value: 50,
    label: "Right"
  },
  {
    value: 100,
    label: "CCW"
  },
  {
    value: 0,
    label: "Equal"
  },
  {
    value: -50,
    label: "Left"
  },
  {
    value: -100,
    label: "CW"
  }
];

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: 80
  },
  papertall: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: 250
  },
  thrustslider: {
    height: 200,
    padding: 20
  },
  diffslider: {
    height: 20,
    padding: 20
  },
  chip: {
    margin: theme.spacing(0.5)
  }
}));

class Telemetry extends React.Component {
  constructor(props) {
    super(props);
    this.state = { x: 0, y: 0, z: 1, heading: 0 };
  }

  updateTelemetry() {
    var requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    var requestURL = {
      remote: "https://zimchaa.zapto.org/telemetry"
    };

    // console.log(requestURL.remote);

    fetch(requestURL.remote, requestOptions)
      .then((response) => response.json())
      .then((result) =>
        this.setState((state) => ({
          x: result.x,
          y: result.y,
          z: result.z,
          heading: result.heading
        }))
      )
      // .then((result) => console.log(this.state))
      .catch((error) => console.log("error", error));
  }

  componentDidMount() {
    this.interval = setInterval(() => this.updateTelemetry(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <Chip icon={<ThreeDRotationIcon />} label={this.state.z.toFixed(2)} />
        <hr />
        <Chip icon={<HorizIcon />} label={this.state.y.toFixed(2)} />
        <hr />
        <Chip icon={<VertIcon />} label={this.state.x.toFixed(2)} />
        <hr />
        <Chip icon={<ExploreIcon />} label={this.state.heading.toFixed(1)} />
        <hr />
      </div>
    );
  }
}

export default function CenteredGrid() {
  const classes = useStyles();
  const [thrustvalue, setThrustValue] = React.useState(0);
  const [diffvalue, setDiffValue] = React.useState(0);
  const [motorspeeds, setMotorSpeeds] = React.useState({ left: 0, right: 0 });
  const [switchcheckedstate, setSwitchState] = React.useState({
    switch1: false,
    switch2: false,
    switch3: false,
    switch4: false
  });
  const [manualcheckedstate, setManualState] = React.useState({
    manualswitch: false
  });

  const handleMovementChange = (newthrustvalue, newdiffvalue) => {
    console.log("thrust new/current: " + newthrustvalue + "/" + thrustvalue);
    console.log("diff new/current: " + newdiffvalue + "/" + diffvalue);

    if (newthrustvalue !== thrustvalue || newdiffvalue !== diffvalue) {
      var requestOptions = {
        method: "PUT",
        redirect: "follow"
      };

      var requestURL = {
        remote:
          "https://zimchaa.zapto.org/thrust/" +
          newthrustvalue +
          "/diff/" +
          newdiffvalue
      };

      console.log(requestURL.remote);

      fetch(requestURL.remote, requestOptions)
        .then((response) => response.json())
        .then((result) => handlemovementChangeResult(result))
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));
    } else {
      console.log("no change");
    }
  };

  const handlemovementChangeResult = (movementresult) => {
    setMotorSpeeds(movementresult.motorspeeds);
    setThrustValue(movementresult.thrust);
    setDiffValue(movementresult.diff);
    return movementresult;
  };

  const handlethrustChange = (event, newValue) => {
    setThrustValue(newValue);
    handleMovementChange(newValue, diffvalue);
  };

  const handleDiffChange = (event, newValue) => {
    setDiffValue(newValue);
    handleMovementChange(thrustvalue, newValue);
  };

  const handleLightSwitch = (toggleLight) => {
    var requestOptions = {
      method: "PUT",
      redirect: "follow"
    };

    var requestURL = {
      remote: "https://zimchaa.zapto.org/rainbow",
      allon: "/6",
      alloff: "/5",
      pixel1: "/0",
      white: "/255/150/200",
      red: "/255/0/0",
      brightness: "/150"
    };

    var composedURL = requestURL.remote;

    if (toggleLight) {
      composedURL = composedURL + requestURL.allon;
      composedURL = composedURL + requestURL.white + requestURL.brightness;
    } else {
      composedURL = composedURL + requestURL.alloff;
    }

    console.log(composedURL);

    fetch(composedURL, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  const handleSwitchChange = (event) => {
    setSwitchState({
      ...switchcheckedstate,
      [event.target.name]: event.target.checked
    });

    if (event.target.name === "switch1") {
      handleLightSwitch(event.target.checked);
    }

    console.log(
      "switch: " + event.target.name + "\nchecked: " + event.target.checked
    );
  };

  const handleManualChange = (event) => {
    setManualState({
      ...manualcheckedstate,
      [event.target.name]: event.target.checked
    });
    console.log(
      "switch: " + event.target.name + "\nchecked: " + event.target.checked
    );
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Paper className={classes.papertall}>
            <div className={classes.thrustslider}>
              <Slider
                value={thrustvalue}
                onChange={handlethrustChange}
                aria-labelledby="thrustslider"
                orientation="vertical"
                max={100}
                min={-100}
                marks={thrustmarks}
                valueLabelDisplay="auto"
                step={10}
                track={false}
                name="thrustslider"
              />
            </div>
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper className={classes.papertall}>
            <img
              src="https://zimchaa.zapto.org/stream/stream.mjpg"
              height="100%"
              alt="Live stream: Robot"
            />
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.papertall}>
            <Telemetry />
            <Chip
              icon={<SpeedIcon />}
              label={motorspeeds.left + "/" + motorspeeds.right}
            />
          </Paper>
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          <Paper className={classes.paper}>
            <div className={classes.diffslider}>
              <Slider
                value={diffvalue}
                onChange={handleDiffChange}
                aria-labelledby="diffslider"
                max={100}
                min={-100}
                marks={diffmarks}
                valueLabelDisplay="auto"
                step={10}
                track={false}
                name="diffslider"
              />
            </div>
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper}>
            <FormControl component="fieldset">
              <FormGroup aria-label="position" row>
                <FormControlLabel
                  value="manualswitchcontrol"
                  control={
                    <Switch
                      color="primary"
                      checked={manualcheckedstate.manualswitch}
                      onChange={handleManualChange}
                      name="manualswitch"
                      disabled={true}
                    />
                  }
                  label={<ManualIcon />}
                  labelPlacement="top"
                />
              </FormGroup>
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper}>
            <FormControl component="fieldset">
              <FormGroup aria-label="position" row>
                <FormControlLabel
                  value="switch1control"
                  control={
                    <Switch
                      color="primary"
                      checked={switchcheckedstate.switch1}
                      onChange={handleSwitchChange}
                      name="switch1"
                    />
                  }
                  label={<HighlightIcon />}
                  labelPlacement="top"
                />
              </FormGroup>
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper}>
            <FormControl component="fieldset">
              <FormGroup aria-label="position" row>
                <FormControlLabel
                  value="switch2control"
                  control={
                    <Switch
                      color="primary"
                      checked={switchcheckedstate.switch2}
                      onChange={handleSwitchChange}
                      name="switch2"
                    />
                  }
                  label={<TwoIcon />}
                  labelPlacement="top"
                />
              </FormGroup>
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper}>
            <FormControl component="fieldset">
              <FormGroup aria-label="position" row>
                <FormControlLabel
                  value="switch3control"
                  control={
                    <Switch
                      color="primary"
                      checked={switchcheckedstate.switch3}
                      onChange={handleSwitchChange}
                      name="switch3"
                    />
                  }
                  label={<ThreeIcon />}
                  labelPlacement="top"
                />
              </FormGroup>
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper}>
            <FormControl component="fieldset">
              <FormGroup aria-label="position" row>
                <FormControlLabel
                  value="switch4control"
                  control={
                    <Switch
                      color="primary"
                      checked={switchcheckedstate.switch4}
                      onChange={handleSwitchChange}
                      name="switch4"
                    />
                  }
                  label={<FourIcon />}
                  labelPlacement="top"
                />
              </FormGroup>
            </FormControl>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}