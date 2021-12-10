import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { ImCross } from 'react-icons/im';
import s from './Modal.module.css';
import PropTypes from 'prop-types';

const modalRoot = document.querySelector('#modal-root');

export default class Modal extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDowm);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDowm);
  }

  handleKeyDowm = e => {
    if (e.code === 'Escape') {
      this.props.onClose();
    }
  };

  handleBackdropClick = e => {
    if (e.currentTarget === e.target) {
      this.props.onClose();
    }
  };

  render() {
    return createPortal(
      <div className={s.Overlay} onClick={this.handleBackdropClick}>
        <div className={s.Modal}>
          {this.props.children}
          <button type="button" className={s.ModalButton}>
            <ImCross
              className={s.ModalCloseIcon}
              onClick={this.props.onClose}
            />
          </button>
        </div>
      </div>,
      modalRoot,
    );
  }
}
