import { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import Container from './components/Container';
import Searchbar from './components/Searchbar';
import ImageGallery from './components/ImageGallery';
import imagesApi from './services/ImagesApi';
import Button from './components/Button';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Modal from './components/Modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import s from './components/Loader/Loading.module.css';

export default class App extends Component {
  state = {
    inputValue: '',
    imageGallery: [],
    showModal: false,
    modalImg: '',
    modalAlt: '',
    page: 1,
    error: null,
    status: 'idle',
  };

  componentDidUpdate(prevProp, prevState) {
    const prevValue = prevState.inputValue;
    const nextValue = this.state.inputValue;

    const prevPage = prevState.page;
    const nextPage = this.state.page;

    if (nextPage > 1) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }

    if (prevValue !== nextValue) {
      this.setState({ imageGallery: [], status: 'pending' });
    }

    if (prevValue !== nextValue || prevPage !== nextPage) {
      imagesApi
        .fetchImages(nextValue, nextPage)
        .then(({ hits }) => {
          const images = hits.map(
            ({ id, webformatURL, largeImageURL, tags }) => {
              return { id, webformatURL, largeImageURL, tags };
            },
          );
          if (images.length > 0) {
            this.setState(prevState => {
              return {
                imageGallery: [...prevState.imageGallery, ...images],
                status: 'resolved',
              };
            });
          } else {
            toast.warn(`По вашему запросу ${nextValue} ничего нет!`, {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            this.setState({ status: 'idle' });
          }
        })
        .catch(error => this.setState({ error, status: 'rejected' }));
    }
  }

  hundleFormSubmit = inputValue => {
    if (inputValue !== this.state.inputValue) {
      this.setState({ inputValue, page: 1, status: 'pendind' });
    }
  };

  handleClickButton = () => {
    this.setState(({ page }) => {
      return { page: page + 1, status: 'pending' };
    });
  };
  handleClickImg = e => {
    const imgForModal = e.target.dataset.src;
    const altForModal = e.target.alt;
    this.setState({
      showModal: true,
      modalImg: imgForModal,
      modalAlt: altForModal,
    });
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };

  render() {
    const { status, imageGallery, error, showModal, modalImg, modalAlt } =
      this.state;
    return (
      <Container>
        {status === 'idle' && <Searchbar onSubmit={this.hundleFormSubmit} />}
        {status === 'pending' && (
          <>
            <Searchbar onSubmit={this.hundleFormSubmit} />
            <ImageGallery images={imageGallery} />
            {imageGallery.length > 0 && <ImageGallery images={imageGallery} />}
            <Loader
              className={s.loader}
              type="ThreeDots"
              color="#00BFFF"
              height={80}
              width={80}
            />
          </>
        )}

        {status === 'resolved' && (
          <>
            {showModal && (
              <Modal onClose={this.toggleModal}>
                <img src={modalImg} alt={modalAlt} />
              </Modal>
            )}
            <Searchbar onSubmit={this.hundleFormSubmit} />
            <ImageGallery onClick={this.handleClickImg} images={imageGallery} />
            <Button onClick={this.handleClickButton} />
          </>
        )}

        {status === 'rejected' && <h2>{error.message}</h2>}
        <ToastContainer theme={'colored'} />
      </Container>
    );
  }
}
