import React from 'react';

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
    const mainPurse = this.props.purses['1'];
    const dataMainPurse = JSON.parse(decodeURI(this.props.pursesData['2']));

    const over = !mainPurse || mainPurse.quantity === 0;
    const contributions = Object.keys(this.props.purses)
      .filter((k) => k !== '1' && k !== '2')
      .sort((a, b) => {
        if (parseInt(a) < parseInt(b)) {
          return 1;
        } else {
          return -1;
        }
      });

    const keys = Object.keys(this.props.purses);
    let sold = 0;
    for (let i = 1; i < keys.length; i += 1) {
      if (keys[i] !== '1' && keys[i] !== '2' && this.props.purses[keys[i]].type === '0') {
        sold += this.props.purses[keys[i]].quantity;
      }
    }
    const total = dataMainPurse.quantity;
    return (
      <div className="tip-board">
        <h3 className="title is-3">{this.props.values.title}</h3>
        <span className="link">
          tipboard?master={this.props.masterRegistryUri}&contract={this.props.contractId}
        </span>
        {this.props.values.description && (
          <p className="description">{this.props.values.description}</p>
        )}
        {over && <p>All tokens are sold !</p>}
        <p>
          {sold} out of {total} tokens sold ({Math.round((100 * sold) / total)}
          %)
        </p>
        <p>
          {mainPurse ? (
            <span>
              {mainPurse.quantity} tokens are for sale at a price of{' '}
              {formatter.format(mainPurse.price / 100000000)} REV per token
            </span>
          ) : undefined}
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
                <label className="label">Contribution price</label>
                <div>
                  <span className="total-price">
                    <b>
                      {formatter.format(
                        (this.state.quantity * mainPurse.price) / 100000000
                      )}
                    </b>
                    {' REV'}
                  </span>
                  <br />
                  {this.state.quantity * mainPurse.price < 100000000 && (
                    <span className="total-price">
                      <b>
                        {formatter.format(
                          this.state.quantity * mainPurse.price
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
          </div>
        )}
        <div className="tips">
          <p>{contributions.length} contributions :</p>
          {contributions.map((purseId) => {
            let data;
            try {
              data = JSON.parse(decodeURI(this.props.pursesData[purseId]));
            } catch (err) {
              console.log(err);
              return (
                <p key={purseId} className="">
                  Unable to parse
                </p>
              );
            }
            return (
              <p key={purseId}>
                <b className="name">
                  {this.props.pursesData[purseId] ? data.name : 'Anonymous'}
                </b>{' '}
                <span>tipped</span>
                <b className="amount">
                  {formatter.format(
                    (this.props.purses[purseId].quantity *
                      dataMainPurse.price) /
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
