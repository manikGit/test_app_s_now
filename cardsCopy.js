import React, { Component } from 'react';
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

class Cards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      initialData: [],
      cardData: [],
      loadingState: false
    };
    this.handleChange.bind(this)
  }

  handleChange = (event) => {
    let inputVal = event.target.value;
    this.setState({ inputValue: inputVal });
    let cardData = this.state.initialData;
    inputVal = inputVal.toLowerCase();
    console.log("inputVal " + inputVal);
    // console.log("cardData " + JSON.stringify(cardData).toLowerCase());
    let filteredData = cardData.filter((data, i) => {
      return ((JSON.stringify(data.name).indexOf(inputVal) > -1) || (JSON.stringify(data.surname).indexOf(inputVal) > -1)
        || (JSON.stringify(data.email).indexOf(inputVal) > -1) || (JSON.stringify(data.gender).indexOf(inputVal) > -1)
        || (JSON.stringify(data.age).indexOf(inputVal) > -1))
    })
    // JSON.stringify(data).toLowerCase().indexOf(inputVal.toLowerCase())
    console.log("filteredData data ready" + JSON.stringify(filteredData));
    this.setState({ cardData: filteredData })

    if (inputVal == "") {
      this.setState({ cardData: this.state.initialData })
    }
  }

  loadMoreCards() {
    if (this.state.loadingState) {
      return;
    }
    if (this.state.cardData.length == 0) {
      return;
    }
    let cardShowNum = this.state.cardShowNum;
    this.setState({ loadingState: true });
    let obj = {
      mode: 'cors'
    }
    console.log("total cards: " + this.state.cardData.length)
    setTimeout(() => {
      //uiname.com Resource Limit Reached
      // fetch('https://uinames.com/api/?amount=10&region=germany&ext', obj)
      //   .then(response => response.json())
      //   .then((data) => {
      //     console.log("loadMoreCards called ")
      //     this.setState({ initialData: data, cardData: [...this.state.cardData, ...data], loadingState: false })
      //   });

      let user10data = jsonData.slice(0, 10)
      this.setState({ initialData: user10data, cardData: [...this.state.cardData, ...user10data], loadingState: false })

    }, 500);
  }

  componentDidMount() {
    this.refs.iScroll.addEventListener("scroll", () => {
      if (this.refs.iScroll.scrollTop + this.refs.iScroll.clientHeight >= this.refs.iScroll.scrollHeight - 20) {
        this.loadMoreCards();
      }
    });

    this.refs.searchText.addEventListener("keyup", () => {
      // console.log("key pressed");
      this.setState({ loadingState: false });
    });
    let obj = {
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    console.log("componentDidMount called ");
    //uiname.com Resource Limit Reached
    // https://uinames.com/api/?amount=10&region=germany&ext
    // fetch('./json/jsonData.json',obj)
    //   .then(response => response.json())
    //   .then((data) => {
    //    this.setState({ initialData: data, cardData: data })
    //   })
    //   .catch(err => console.log(err));

    let user10data = jsonData.slice(0, 10)

    this.setState({ initialData: user10data, cardData: user10data })
    // console.log("jsonData: "+JSON.stringify(jsonData))

  }
  onDragStart = (e, index) => {
    this.draggedItem = this.state.cardData[index];
    
    console.log("onDragStart index: "+index+"this.draggedItem: "+JSON.stringify(this.draggedItem))
    e.dataTransfer.setData("text/html", e.target.parentNode);
  }
  onDragOver = (index) => {
    const draggedOverItem = this.state.cardData[index];
    let draggedIndex = index;
    console.log("onDragOver index: "+index+"this.draggedItem: "+JSON.stringify(this.draggedItem)+" | this.draggedItem: "+JSON.stringify(this.draggedItem))

    if (this.draggedItem === draggedOverItem) {
      return;
    }
    // event.target.style.cursor = 'move'; 
    // let items1 = this.state.cardData.filter((item, i) => item[i] !== this.draggedItem);

    let items2 = this.state.cardData.filter((value,i) => {
      return (value[i] !== this.draggedItem)
    })
    console.log("items2: "+JSON.stringify(items2));

    // items1.splice(index, 0, this.draggedItem);
    this.setState({ cardData: items2 });
  }
  onDragEnd = (evnt) => {
    this.draggedIdx = null;
  }
  // <img className="sn_logo" src="https://www.servicenow.com/content/dam/servicenow-assets/images/meganav/servicenow-header-logo.svg" alt="Service Now" heigth="70" />
  render() {

    return (
      <React.Fragment>
        <header className="headerStyle">
          <section className="sectionHeader">

          </section>
          <section className="searchBoxDiv">
            <input
              id="searchBox"
              label="Search..."
              placeholder="Type here to search"
              ref="searchText"
              // className={classes.textField}
              margin="normal"
              value={this.state.inputValue}
              onChange={this.handleChange}
            />
          </section>
        </header>
        <section>
          <div ref="iScroll" className="divStyle">
            <ul style={{ paddingInlineStart: '10px', marginInlineEnd: '20px' }}>
              {this.state.cardData.map((data, i) => {
                return <li className="listStyle">
                  <article key={i} style={{ outlineColor: '#293e40' }} tabIndex="0" onDragOver={() => this.onDragOver(i)}
                  >
                    <Card draggable
                      onDragStart={e => this.onDragStart(e, i)}
                      onDragEnd={this.onDragEnd}
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
                  </article>
                </li>
              }
              )
              }
              {this.state.loadingState ? <p className="loading"> loading...</p> : ""}
            </ul>
          </div>
        </section>
      </React.Fragment>
    )
  }
}

export default Cards;