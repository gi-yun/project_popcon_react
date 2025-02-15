import './SignupComponent.css';
import {
  Form,
  redirect,
  json,
  useActionData
} from 'react-router-dom';
import sign_up from '../image/store_image/sign_up.png'

function SignupComponent() {

  //실패경우1 - 400: Bad Request 발생시 에러처리
  const data = useActionData();
  console.log("useActionData:", data);

  return (
        <div className="signUp-container flex-c">
            <div className="signUp-box flex-c flex-d-column">
                <img src={sign_up} alt=""/>
                <Form method="post" className="signUp-form flex-sb flex-d-column">
                    <div className="signUp-name-box flex-sb">
                        <input type="text" name="userid" placeholder="아이디"/>
                        <button className="thema-btn-01">중복확인</button>
                    </div>
                    <input type="password" name="password" placeholder="비밀번호"/>
                    <input type="password" placeholder="비밀번호 확인"/>
                    <input type="text" name="username" placeholder="이름"/>
                    <input type="date" name="date" placeholder=""/>
                    <div className="signUp-phone-box flex-sb">
                        <input type="text" name="phone1" placeholder="010"/>
                        <input type="text" name="phone2" placeholder="0000"/>
                        <input type="text" name="phone3" placeholder="0000"/>
                    </div>
                    <div className="signUp-email-box flex-sb">
                        <input type="text" name="email"/>
                        <select name="" id="">
                            <option value="">naver.com</option>
                            <option value=""></option>
                            <option value=""></option>
                            <option value=""></option>
                        </select>
                    </div>
                    <div className="signUp-address flex-sb">
                        <input type="text" name="add1"/>
                        <button className="thema-btn-01">주소찾기</button>
                    </div>
                    <input type="text" name="add2"/>
                    <div className="signUp-button-box flex-sb">
                        <button className="thema-btn-01">회원가입</button>
                        <button className="thema-btn-03">취소</button>
                    </div>
                </Form>
            </div>
        </div>
  );
}

export async function action({request}){

  // 회원가입폼 데이터 얻기
  const data = await request.formData();
  const authData = {
    customerId: data.get('userid'),
    customerPw: data.get('password'),
    customerName: data.get('username'),
    customerPhone: `${data.get('phone1')}-${data.get('phone2')}-${data.get('phone3')}`,
    customerDate: data.get('date'),
    customerAdd: data.get('add1'),  
    customerAddMore: data.get('add2'),
    customerEmail: `${data.get('email')}@${data.get('emailDomain')}`,
    customerEmailDomain: 'naver.com',
    customerRate: '1',
    customerRole: '1',
  };
  console.log("authData>>", authData);

  const response = await fetch('http://localhost:8090/popcon/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(authData),
  });

  console.log("회원가입 요청결과:", response);

  //실패경우1 - 400: Bad Request 와 401: Unauthorized
  //  실습은 스프리의 @Valid 위반시 400 에러가 발생됨. 이 경우 response를 바로 리턴하면 
  //  폼에서 useActionData()로 에러를 처리할 수 있음.
  if (response.status === 400 || response.status === 401 || response.status === 422) {
    console.log("response.status>>", response.status);
    return response;
  }
  
  //실패경우2- 전반적인 서버에러 ( 예> userid 중복에러 )
  if (!response.ok) {
    console.log("response.status>>", response.status);
    throw  json(
      {
        message:'요청에 대한 처리 불가.',
        title:'요청에러',
        email:'inky4832@daum.net'
      },
      {status:500}
   )
  } 

  return redirect('/');
}//end action

export default SignupComponent;
