import React from "react";

import { formatter } from "./utils";

export class TipBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 0,
      name: "",
    };
  }

  render() {
    console.log(this.props);
    const bagIds = Object.keys(this.props.bags).sort(
      (a, b) => parseInt(b) - parseInt(a)
    );
    const over = this.props.values.sold[1] === this.props.values.sold[0];
    return (
      <div className="tip-board">
        <h3 className="title is-3">{decodeURI(this.props.values.title)}</h3>
        {this.props.values.description && (
          <p className="description">
            {decodeURI(this.props.values.description)}
          </p>
        )}
        {over && <h3 className="title is-4">All tokens are sold !</h3>}
        <p>
          {this.props.values.sold[1]} out of {this.props.values.sold[0]} tokens
          sold (
          {Math.round(
            (100 * this.props.values.sold[1]) / this.props.values.sold[0]
          )}
          %)
        </p>
        <p>
          {this.props.values.sold[0] - this.props.values.sold[1]} tokens are for
          sale at a price of{" "}
          {formatter.format(this.props.values.price / 100000000)} REV per token
        </p>
        <br />
        {!over && (
          <div className="cell-form">
            <div className="field">
              <label className="label">Quantity to purchase</label>
              <div className="control">
                <input
                  defaultValue={this.state.quantity}
                  onInput={(e) =>
                    this.setState({ quantity: parseInt(e.target.value) })
                  }
                  className="input"
                  type="number"
                  min={1}
                  step={1}
                  max={this.props.max}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Name</label>
              <div className="control">
                <input
                  defaultValue={this.state.name}
                  onInput={(e) => this.setState({ name: e.target.value })}
                  className="input"
                  type="text"
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Total price</label>
              <div>
                <span className="total-price">
                  <b>
                    {formatter.format(
                      (this.state.quantity * this.props.values.price) /
                        100000000
                    )}
                  </b>
                  {" REV"}
                </span>
                <br />
                {this.state.quantity * this.props.values.price < 100000000 && (
                  <span className="total-price">
                    <b>
                      {formatter.format(
                        this.state.quantity * this.props.values.price
                      )}
                    </b>
                    {" dusts"}
                  </span>
                )}
              </div>
            </div>
            <div className="field">
              <br />
              <button
                className="button is-light"
                disabled={!this.state.quantity}
                type="button"
                onClick={(e) => {
                  if (this.state.quantity) {
                    this.props.onPurchase({
                      quantity: this.state.quantity,
                      data: encodeURI(this.state.name),
                    });
                  }
                }}
              >
                Tip !
              </button>
            </div>
          </div>
        )}
        <div className="tips">
          <p>{bagIds.length - 1} contributions :</p>
          {bagIds.map((bagId) => {
            if (bagId === "0") {
              return undefined;
            }

            return (
              <p key={bagId}>
                <b className="name">
                  {this.props.bagsData[bagId]
                    ? decodeURI(this.props.bagsData[bagId])
                    : "Anonymous"}
                </b>{" "}
                <span>tipped</span>
                <b className="amount">
                  {formatter.format(
                    (this.props.bags[bagId].quantity *
                      this.props.values.price) /
                      100000000
                  )}{" "}
                  REV
                </b>
              </p>
            );
          })}
        </div>
      </div>
    );
  }
}
