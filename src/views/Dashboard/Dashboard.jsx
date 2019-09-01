
import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import AddExelSheet from '../../components/Addexcel/addexcel.js'
import SelectBranch from '../../components/SelectBranch/selectBranch'
import Dialog from '@material-ui/core/Dialog';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";
import Swal from "sweetalert2";
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
var firebase = require("firebase");

class Dashboard extends React.Component {
  constructor(){
    super()
    this.state = {
      value: 0,
      show:false
    };
  }
  
  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  getSwitches(switchtable){
    let switch_list = []
    for (let i=0;i<switchtable.length;i++){
      switch_list.push(switchtable[i].switch)
    }
    console.log("Switches List: "+switch_list)
    this.setState({
      switch_list: switch_list
    })
  }

  getSections(switchtable){
    let section_list = []
    for (let i=0;i<switchtable.length;i++){
      let temp_list = switchtable[i].section.split(",")
      for(let j=0;j<temp_list.length;j++){
        if(section_list.indexOf(temp_list[j])===-1){
          section_list.push(temp_list[j])
        }
      }
      
    }
    console.log("Section List: "+section_list)
    this.setState({
      section_list: section_list
    })
  }

  getSectionOfSwitch(switchtable, switch_no){
    for (let i=0;i<switchtable.length;i++){
      if(switchtable[i].switch === switch_no){
        return switchtable[i].section.split(",")
      } 
    }
  }

  generatePhysicalConMatrix(switchtable){
    let switch_list = this.state.switch_list
    let section_list = this.state.section_list

    let physicalConMatrix = []

    for(let i=0;i<switch_list.length;i++){
      let temp_list = []
      for(let j=0;j<section_list.length;j++){
        temp_list[j] = 0
      }
      physicalConMatrix.push(temp_list)
    }

    for(let i=0;i<switch_list.length; i++){
      //console.log(this.getSectionOfSwitch(switchtable, switch_list[i]))
      let temp_list = this.getSectionOfSwitch(switchtable, switch_list[i])
      for (let j=0; j<temp_list.length; j++){
        physicalConMatrix[i][section_list.indexOf(temp_list[j])] = 1
      }
    }
    console.log("Physical connection matrix")
    console.log(physicalConMatrix)
  }

  /*Change map details on change of the drop down*/
  selectMapEventHandler=(event)=>{
    this.setState({
        branch: event.target.value
    })
    //console.log(this.state.branch)
    firebase.database().ref().child(event.target.value)
    .once('value')
    
    .then((snapshot) => {
        const val = snapshot.val();
        this.setState({switchtable:val.switchtable})

        this.getSwitches(this.state.switchtable)
        this.getSections(this.state.switchtable)
        this.generatePhysicalConMatrix(this.state.switchtable)

      })
      .catch((e) => {
          console.log(e)
          Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
          })
      });

  }

  handleClose = (element) => {
    this.setState({ show: false });
  }

  handleShow = () => {
    this.setState({
        show: true,
    });
  }

  render() {
    return (
      <div>
        <div className="row">
            <div className="col-md-3">
                <AddExelSheet/>
            </div>
            <div className="col-md-3">
            </div>
            <div className="col-md-3">
                <SelectBranch changed={this.selectMapEventHandler}/>
            </div>
            <div>
              <button onClick={this.handleShow} className="btn btn-default btn-sm"><i className="fa fa-arrow-up"></i></button>
            </div>
        </div>  
        <div>
        <Dialog
        open={this.state.show}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous location data to
            Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={this.handleClose} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
        </div>             
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
