import React, { Component } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import jsonData from './json/jsonData.json';

import '../app.css';

const reorder = (list, sIndex, eIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(sIndex, 1);
  result.splice(eIndex, 0, removed);
  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: '0px',
  margin: isDragging ? '0px 0px 0px 10px' : `0 0 ${grid}px 0`,
  background: isDragging ? "transparent" : "transparent",
  outlineColor: '#293E40',
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "transparent" : "#81B5A1",
  width: '100%'
});

class CardsAccessible extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      inputValue: '',
      initialData: [],
      cardData: [],
      loadingState: false,
      dragging: false
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }
  handleChange = (event) => {
    let inputVal = event.target.value;
    this.setState({ inputValue: inputVal });
    let items = this.state.initialData;
    inputVal = inputVal.toLowerCase();
    console.log("inputVal " + inputVal);
    // console.log("items " + JSON.stringify(items).toLowerCase());
    let filteredData = items.filter((data) => {
      return ((JSON.stringify(data.name).indexOf(inputVal) > -1) || (JSON.stringify(data.surname).indexOf(inputVal) > -1)
        || (JSON.stringify(data.email).indexOf(inputVal) > -1) || (JSON.stringify(data.gender).indexOf(inputVal) > -1)
        || (JSON.stringify(data.age).indexOf(inputVal) > -1))
    })
    // JSON.stringify(data).toLowerCase().indexOf(inputVal.toLowerCase())
    console.log("filteredData data ready");
    this.setState({ items: filteredData })

    if (inputVal == "") {
      this.setState({ items: this.state.initialData });
      this.setState({ loadingState: false });
    } else {
      this.setState({ loadingState: true });
    }
  }
  componentDidMount() {
    console.log("componentDidMount called ");
    axios.get('https://uinames.com/api/?amount=10&region=germany&ext')
      .then((response) => {
        let data = response.data;
        console.log("data loaded from  https://uinames.com");
        this.setState({ initialData: data, items: data })
      })
      .catch((error) => {
        console.log("erro " + error.message);
        //uiname.com Resource Limit Reached
        console.log("Loading from local json")
        let user10data = jsonData.slice(0, 10)
        this.setState({ initialData: user10data, items: [...this.state.items, ...user10data], loadingState: false })
      });

    // this.refs.searchText.addEventListener("keyup", () => {
    //   console.log("key pressed " + this.state.inputValue);
    //   if (this.state.inputValue != "") {
    //     this.setState({ loadingState: true });
    //   } else {
    //     this.setState({ loadingState: false });
    //   }
    // });

    this.refs.iScroll.addEventListener("scroll", () => {
      if (this.refs.iScroll.scrollTop + this.refs.iScroll.clientHeight >= this.refs.iScroll.scrollHeight - 20) {
        this.loadMoreCards();
      }
    });

  }
  loadMoreCards() {
    if (this.state.loadingState) {
      return;
    }
    if (this.state.dragging) {
      return;
    }
    if (this.state.items.length == 0) {
      return;
    }
    let cardShowNum = this.state.cardShowNum;
    this.setState({ loadingState: true });
    console.log("total cards: " + this.state.items.length)
    setTimeout(() => {
      axios.get('https://uinames.com/api/?amount=10&region=germany&ext')
        .then((response) => {
          let data = response.data;
          console.log("loadMoreCards called ")
          this.setState({ initialData: data, items: [...this.state.items, ...data], loadingState: false })
        }).catch((err) => {
          //uiname.com Resource Limit Reached
          console.log("Loading from local json");
          let user10data = jsonData.slice(0, 10)
          this.setState({ initialData: user10data, items: [...this.state.items, ...user10data], loadingState: false })
        });
    }, 500);
  }
  onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );
    this.setState({
      items
    });
    this.setState({ dragging: false })
  }
  onDragStart = () => {
    this.setState({ dragging: true })
  }
  render() {
    return (
      <React.Fragment>
        <header className="headerStyle">
          <section className="sectionHeader">
          </section>
          <section className="searchBoxDiv">
            <label style={{ color: 'white' }}> </label>
            <input
              id="searchBox"
              label="Search..."
              placeholder="Type here to search"
              ref="searchText"
              // className={classes.textField}
              margin="normal"
              value={this.state.inputValue}
              onChange={this.handleChange}
              tabIndex="0"
              autoFocus
              aria-label="Type here to search"
            />
          </section>
        </header>

        <div ref="iScroll" className="divStyle">
          <DragDropContext onDragStart={this.onDragStart} onDragEnd={this.onDragEnd} >
            <Droppable droppableId="droppable" >
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {this.state.items.map((data, i) => (
                    <Draggable key={`item-${i}`} draggableId={`item-${i}`} index={i} aria-roledescription="Draggable item. Press space bar to lift">
                      {(provided, snapshot) => (
                        <div
                          // ref="iScroll"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <List key={i} className="listStyle" style={{ paddingLeft: '4vh', paddingRight: '4vh' }}  >
                            <ListItem className="innerListStyle" style={{ outlineColor: '#293e40', padding: '0px' }} onDragOver={(e) => this.onDragOver(e, i)}
                            >
                              <Card draggable
                                onDragStart={e => this.onDragStart(e, i)}
                                onDragEnd={e => this.onDragEnd(e)}
                              >
                                <CardHeader
                                  avatar={
                                    <Avatar alt={data.name} src={data.photo} />
                                  }
                                  title={data.name + " " + data.surname}
                                  subheader={data.email}
                                >
                                </CardHeader>
                                <CardContent>
                                  <Typography variant="body2" color="textSecondary" component="p">
                                    Gender: {data.gender}
                                  </Typography>
                                  <Typography variant="body2" color="textSecondary" component="p">
                                    Age: {data.age}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </ListItem>
                          </List>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <footer className="footerStyle"></footer>
      </React.Fragment>
    );
  }
}

export default CardsAccessible;