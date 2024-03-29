/*!

=========================================================
* Material Dashboard React - v1.7.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

import Swal from "sweetalert2";
import SelectBranch from "components/SelectBranch/selectBranch";
var firebase = require("firebase");

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};



class FeedingPointsMatrix extends React.Component {
  
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

  getNormallyOpenSwitches(noopn){
    let noopensw_list = []
    for(let i=0;i<noopn.length;i++){
      noopensw_list.push(noopn[i].no_open)
    }
    console.log("Normally open switches: "+noopensw_list)
    this.setState({
      noopensw_list: noopensw_list
    })
  }

  getFeedingPoints(feedingpoints){
    let feeding_list = []
    for(let i=0;i<feedingpoints.length;i++){
      feeding_list.push(feedingpoints[i].feed_points)
    }
    console.log("Feeding points: "+feeding_list)
    this.setState({
      feeding_list: feeding_list
    })
  }

  generatePhysicalConMatrix(switchtable){
    let switch_list = this.state.switch_list
    let section_list = this.state.section_list

    let physicalConMatrix = []

    for(let i=0;i<switch_list.length;i++){
      let temp_list = []
      for(let j=0;j<section_list.length;j++){
        temp_list[j] = "0"
      }
      physicalConMatrix.push(temp_list)
    }

    for(let i=0;i<switch_list.length; i++){
      //console.log(this.getSectionOfSwitch(switchtable, switch_list[i]))
      let temp_list = this.getSectionOfSwitch(switchtable, switch_list[i])
      for (let j=0; j<temp_list.length; j++){
        physicalConMatrix[i][section_list.indexOf(temp_list[j])] = "1"
      }
    }
    this.setState({
      physicalConMatrix: physicalConMatrix
    })
    console.log("Physical connection matrix")
    console.log(physicalConMatrix)
  }

  generateElectricConnectivityMatrix(){
    let electricConMatrix = JSON.parse(JSON.stringify(this.state.physicalConMatrix))
    let no_open = this.state.noopensw_list
    let sw_list = this.state.switch_list
    let se_list_len = this.state.section_list.length

    for(let i=0;i<no_open.length;i++){
      let sw_index = sw_list.indexOf(no_open[i])
      for(let j=0;j<se_list_len;j++){
        electricConMatrix[sw_index][j] = "0"
      }
    }
    this.setState({
      electricConMatrix: electricConMatrix
    })
    console.log("Electric connected matrix")
    console.log(electricConMatrix)
  }

  generateFeedingMatrix(){
    let feedMatrix = JSON.parse(JSON.stringify(this.state.electricConMatrix))
    let feed_list = this.state.feeding_list
    let sw_list = this.state.switch_list
    let se_list_length= this.state.section_list.length

    for(let i=0;i<feed_list.length;i++){
      let feed_index = sw_list.indexOf(feed_list[i])
      //console.log(feed_index, feed_list[i])
      for(let j=0;j<se_list_length;j++){
        console.log(feedMatrix[feed_index][j])
        if(feedMatrix[feed_index][j]==="1"){
          
          feedMatrix[feed_index][j] = "11"
        }
      }
      console.log("--------------")
    }

    for(let i=0;i<sw_list.length;i++){
      feedMatrix[i].unshift(sw_list[i])
    }
    
    this.state.section_list.unshift("")
    this.setState({
      feedMatrix: feedMatrix,
      section_list: this.state.section_list
    })
    console.log("Feed matrix")
    console.log(feedMatrix)
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
        this.setState({switchtable:val.switchtable,noswitch:val.noswitch,feedpoints:val.feedpoints})

        this.getSwitches(this.state.switchtable)
        this.getSections(this.state.switchtable)
        this.getNormallyOpenSwitches(this.state.noswitch)
        this.getFeedingPoints(this.state.feedpoints)

        this.generatePhysicalConMatrix(this.state.switchtable)
        this.generateElectricConnectivityMatrix()
        this.generateFeedingMatrix()

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

  render(){
    const { classes } = this.props;
    // const table_data= this.state===null?"":this.state.physicalConMatrix;
    //console.log("table data"+(this.state===null?"":this.state.feedMatrix));
    return (
    <div>
      <div style={{marginTop:'40px'}}>
      <SelectBranch changed={this.selectMapEventHandler}/>
    </div>
      <div>
      <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Feed Matrix</h4>
            <p className={classes.cardCategoryWhite}>
              Here is a subtitle for this table
            </p>
          </CardHeader>
          <CardBody>
          <Table
              tableHeaderColor="primary"
              tableHead={this.state===null?[[]]:this.state.section_list===undefined?[[]]:this.state.section_list}
              tableData={this.state===null?[[]]:this.state.feedMatrix===undefined?[[]]:this.state.feedMatrix}
            />
            
          </CardBody>
        </Card>
      </GridItem>
     
    </GridContainer>
      </div>
      
    
    </div>
    
  );
}
}

FeedingPointsMatrix.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(FeedingPointsMatrix);