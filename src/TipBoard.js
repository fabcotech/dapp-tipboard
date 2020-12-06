import React, { Fragment } from 'react';

import { formatter } from './utils';

export class TipBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 0,
      name: '',
      emoji: undefined,
      displayEmojis: false,
    };
  }

  render() {
    const over = this.props.quantity === 0;
    const contributions = Object.keys(this.props.bags).filter(
      (k) => k !== '0' && this.props.bags[k].n === '0'
    );
    const keys = Object.keys(this.props.bags);
    let sold = 0;
    for (let i = 1; i < keys.length; i += 1) {
      if (keys[i] !== '0' && this.props.bags[keys[i]].n === '0') {
        sold += this.props.bags[keys[i]].quantity;
      }
    }
    const total = this.props.quantity + sold;
    return (
      <div className="tip-board">
        <h3 className="title is-3">{this.props.values.title}</h3>
        {this.props.values.description && (
          <p className="description">{this.props.values.description}</p>
        )}
        {over && <h3 className="title is-4">All tokens are sold !</h3>}
        <p>
          {sold} out of {total} tokens sold ({Math.round((100 * sold) / total)}
          %)
        </p>
        <p>
          {this.props.quantity} tokens are for sale at a price of{' '}
          {formatter.format(this.props.price / 100000000)} REV per token
        </p>
        <br />
        {!over && (
          <div className="contribution-form">
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
                  {this.state.emoji ? (
                    <span className="label-emoji">{this.state.emoji}</span>
                  ) : undefined}
                </div>
              </div>
              <div className="field">
                <label className="label">Total price</label>
                <div>
                  <span className="total-price">
                    <b>
                      {formatter.format(
                        (this.state.quantity * this.props.price) / 100000000
                      )}
                    </b>
                    {' REV'}
                  </span>
                  <br />
                  {this.state.quantity * this.props.price < 100000000 && (
                    <span className="total-price">
                      <b>
                        {formatter.format(
                          this.state.quantity * this.props.price
                        )}
                      </b>
                      {' dusts'}
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
                    let data = { name: this.state.name };
                    if (this.state.emoji) {
                      data.emoji = this.state.emoji;
                    }
                    data = encodeURI(JSON.stringify(data));
                    if (this.state.quantity) {
                      this.props.onPurchase({
                        quantity: this.state.quantity,
                        data: data,
                      });
                    }
                  }}
                >
                  Tip !
                </button>
              </div>
            </div>
            <div className="field">
              {this.props.emojis.length && (
                <p>
                  You can choose an emoji to associate with your contribution
                </p>
              )}
              {this.state.displayEmojis && (
                <a
                  className="emoji-btn"
                  onClick={() => {
                    this.setState({ displayEmojis: false });
                  }}
                  href="#"
                >
                  Hide emojis list
                </a>
              )}
              {!this.state.displayEmojis && this.props.emojis.length && (
                <a
                  className="emoji-btn"
                  onClick={() => {
                    this.setState({ displayEmojis: true });
                  }}
                  href="#"
                >
                  Display emojis list
                </a>
              )}
              {this.state.displayEmojis ? (
                <div className="emojis-list">
                  <span onClick={() => this.setState({ emoji: undefined })}>
                    ✕
                  </span>
                  {this.props.emojis.map((e, i) => {
                    return (
                      <span onClick={() => this.setState({ emoji: e })} key={i}>
                        {e}
                      </span>
                    );
                  })}
                </div>
              ) : undefined}
            </div>
          </div>
        )}
        <div className="tips">
          <p>{contributions.length} contributions :</p>
          {contributions.map((bagId) => {
            let data;
            try {
              data = JSON.parse(decodeURI(this.props.bagsData[bagId]));
            } catch (err) {
              console.log(err);
              return (
                <p key={bagId} className="">
                  Unable to parse
                </p>
              );
            }
            return (
              <p key={bagId}>
                <b className="name">
                  {data.emoji ? data.emoji + ' ' : ''}
                  {this.props.bagsData[bagId] ? data.name : 'Anonymous'}
                </b>{' '}
                <span>tipped</span>
                <b className="amount">
                  {formatter.format(
                    (this.props.bags[bagId].quantity * this.props.price) /
                      100000000
                  )}{' '}
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
