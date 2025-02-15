import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import './LoginModal.css';
import PopconG from '../image/store_image/PopconG.png';
import popcon_logo2 from '../image/store_image/popcon_logo2.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link, Form, redirect, json, useActionData } from 'react-router-dom';  // Add 'json' and 'redirect' imports

const LoginModal = forwardRef((props, ref) => {
  const dialogRef = useRef(null);
  const data = useActionData();

  useImperativeHandle(ref, () => ({
    modal_open: () => dialogRef.current.showModal(),
    modal_close: () => dialogRef.current.close()
  }));

  const handleClose = (e) => {
    if (e.target === dialogRef.current) {
      dialogRef.current.close();
    }
  };

  return (
    <dialog ref={dialogRef} className="modal-login-box" onClick={handleClose}>
      <div className="modal-content flex-sa flex-d-column">
        <FontAwesomeIcon icon={faXmark} className='modal-close' onClick={() => dialogRef.current.close()} />
        <div className="modal-login-img flex-sa flex-d-column">
          <img src={PopconG} alt="PopconG" />
          <img src={popcon_logo2} alt="Popcon Logo" />
        </div>
        <Form method="post" action="/login" className="modal-login-form flex-sb flex-d-column">
          <div className="flex-sa flex-d-column">
            <input type="text" name="userid" placeholder="아이디" required />
            <input type="password" name="password" placeholder="비밀번호" required />
          </div>
          {data?.error && <div className="error-message">{data.error}</div>}
          <div className="modal-login-botton-box flex-sb">
            <button type="submit" className="thema-btn-01">로그인</button>
            <Link className="flex-c thema-btn-02" to="/signup">회원가입</Link>
          </div>
        </Form>
      </div>
    </dialog>
  );
});

export async function action({ request }) {
  const data = await request.formData();
  const authData = {
    userid: data.get('userid'),
    password: data.get('password'),
  };

  const response = await fetch('http://localhost:8090/popcon/authenticate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(authData),
  });

  if (response.status === 400 || response.status === 401 || response.status === 422) {
    return response;
  }
  
  if (!response.ok) {
    throw json(
      {
        message: '요청에 대한 처리 불가.',
        title: '요청에러',
        email: 'inky4832@daum.net'
      },
      { status: 500 }
    );
  } 

  const resData = await response.json();
  const token = resData.token;
  localStorage.setItem('jwtAuthToken', token);
  localStorage.setItem('userid', authData.userid);

  return redirect('/');
}

export default LoginModal;
