import React from "react";

import { formatter } from "./utils";

export class GenesisFormComponent extends React.Component {
  state = {
    title: "Help me buy a sword !",
    description: "",
    price: 100000000,
    quantity: 1000,
  };

  render() {
    console.log(this.state);

    return (
      <div className="genesis-form form">
        <div id="canvas"></div>
        <p>
          Hi ! The tipping board has not been initialized yet. Choose a price
          per token, choose the quantity of tokens you want to create. And
          eventually title and description.
          <br />
          <br />
          By default one token equals one REV and 1000 tokens are created for
          the tip board. Fill free to change the values. Remember that 1 REV
          equals 100.000.000 dusts.
          <br />
          <br />
        </p>
        <div className="field">
          <label className="label">Title</label>
          <div className="control">
            <input
              defaultValue={this.state.title}
              onInput={(e) => this.setState({ title: e.target.value })}
              className="input"
              type="text"
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Description</label>
          <div className="control">
            <textarea
              className="textarea"
              onInput={(e) => {
                this.setState({ description: e.target.value });
              }}
              defaultValue={this.state.description}
            ></textarea>
          </div>
        </div>
        <div className="field">
          <label className="label">Price for each token (dust)</label>
          <div className="control">
            <input
              defaultValue={this.state.price}
              onInput={(e) =>
                this.setState({ price: parseInt(e.target.value) })
              }
              className="input"
              type="number"
              min={1}
              step={1}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Quantity of tokens</label>
          <div className="control">
            <input
              defaultValue={this.state.quantity}
              onChange={(e) =>
                this.setState({ quantity: parseInt(e.target.value) })
              }
              className="input"
              type="number"
              min={1}
              step={1}
            />
          </div>
          {this.state &&
          this.state.price &&
          this.state.quantity &&
          this.state.title ? (
            <p>
              Total REV :{" "}
              {formatter.format(
                (this.state.price * this.state.quantity) / 100000000
              )}{" "}
              <br />
              Total dust (1 REV equals 100.000.000 dust):{" "}
              {formatter.format(this.state.price * this.state.quantity)}{" "}
            </p>
          ) : undefined}
        </div>
        <div className="field">
          <br />
          <button
            className="button is-light"
            disabled={
              !(
                this.state &&
                this.state.price &&
                this.state.quantity &&
                this.state.title
              )
            }
            type="button"
            onClick={(e) => {
              if (
                this.state &&
                this.state.price &&
                this.state.quantity &&
                this.state.title
              ) {
                this.props.onValuesChosen({
                  price: this.state.price,
                  quantity: this.state.quantity,
                  title: encodeURI(this.state.title),
                  description: encodeURI(this.state.description),
                  nonce: this.props.nonce,
                });
              }
            }}
          >
            Save values and create tipping board !
          </button>
        </div>
      </div>
    );
  }
}
