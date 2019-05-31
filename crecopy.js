import React, { Component } from 'react';
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
    let filteredData = cardData.filter((data) => {
      return (JSON.stringify(data).indexOf(inputVal) > -1)
    })
    // JSON.stringify(data).toLowerCase().indexOf(inputVal.toLowerCase())
    console.log("filteredData data ready");
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
      fetch('https://uinames.com/api/?amount=10&region=germany&ext', obj)
        .then(response => response.json())
        .then((data) => {
          console.log("loadMoreCards called ")
          this.setState({ initialData: data, cardData: [...this.state.cardData, ...data], loadingState: false })
        });
      // this.setState({ items: this.state.items + 10, loadingState: false });
      // alert("is loading")
    }, 1000);
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
      mode: 'cors'
    }
    console.log("componentDidMount called ");
    // https://uinames.com/api/?amount=2&ext
    fetch('https://uinames.com/api/?amount=10&region=germany&ext', obj)
      .then(response => response.json())
      .then((data) => {
        // console.log("data: " + JSON.stringify(data))
        this.setState({ initialData: data, cardData: data })
      });

  }
  onDragStart = (e, index) => {
    this.draggedItem = this.state.cardData[index];
    // e.dataTransfer.effectAllowed = "move";
  }
  onDragOver = (event,index) => {
    const draggedOverItem = this.state.cardData[index];
    if (this.draggedItem === draggedOverItem) {
      return;
    }
    // event.target.style.cursor = 'move'; 
    let items = this.state.cardData.filter(item => item !== this.draggedItem);
    items.splice(index, 0, this.draggedItem);
    this.setState({ cardData: items });
    
  }
  onDragEnd = (event) => {
    // event.target.style.cursor = 'pointer'; 
    this.draggedIdx = null;
  }

  render() {

    return (
      <React.Fragment>
        <header>
          <div >
            <TextField
              id="standard-with-placeholder"
              label="Search for list Item:"
              // placeholder="Placeholder"
              ref="searchText"
              // className={classes.textField}
              margin="normal"
              value={this.state.inputValue}
              onChange={this.handleChange}
            />
          </div>
        </header>
        <body>
          <div ref="iScroll" className="divStyle">
            {this.state.cardData.map((data, i) => {
              return <List >
                <ListItem onDragOver={(e) => this.onDragOver(e,i) }
                > 
                  <Card className="draggable" draggable
                    onDragStart={e => this.onDragStart(e, i)}
                    onDragEnd={e => this.onDragEnd(e)}
                  >
                    <CardHeader
                      avatar={
                        <Avatar alt={data.name} src={data.photo} />
                      }
                      title={data.name}
                      subheader={data.surname}
                    >
                    </CardHeader>
                    <CardContent>
                      <Typography variant="body2" color="textSecondary" component="p">
                        This impressive paella is a perfect party dish and a fun meal to cook together with your
                        guests. Add 1 cup of frozen peas along with the mussels, if you like.
                      </Typography>
                    </CardContent>
                  </Card>
                </ListItem>
              </List>
            }
            )
            }
            <footer className="footerStyle">
              {this.state.loadingState ? <p className="loading"> loading...</p> : ""}
            </footer>
          </div>
        </body>
      </React.Fragment>
    )
  }
}

export default Cards;