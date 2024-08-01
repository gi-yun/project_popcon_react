import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";    
import './FaqComponent.css';
import './CustomerService.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import ErrorPage from './Error';




const FaqComponent=()=> {
    // 데이터, 로딩, 에러 상태확인
    const[faqs, setFaqs] = useState([]); 
    const[loading, setLoading]=useState(true);
    const[error, setError]=useState(null);
    
    useEffect(() => {
        const fetchFaqs = async () =>{
            try{
                // DB에 비동기 데이터 요청
                const faqResponse = await fetch('http://localhost:8090/popcon/faq');
                    if(!faqResponse.ok){
                    throw new Error('네트워크 상태가 구립니다.') //응답이 성공이 아닐 경우
                    }
                    const faqData  = await faqResponse.json();
                    setFaqs(faqData); // DB 데이터 저장
                }  catch(error){
                    setError(error.message); // 에러 상태 업데이트
                }   finally{
                    setLoading(false); // 로딩 상태 업데이트 (중단)
                }
        };
        fetchFaqs();
    },[]);

    console.log(faqs);
    //로딩 및 에러 처리
    if(loading) return <div> 로딩중</div>;
    if(error) return <ErrorPage/>;

    return (
        <div className="customer-service-page flex-d-column flex-sb">
            <div className="inquiry-header">
                <div className="inquiry-h1"><h1>자주 묻는 질문</h1></div>
                <div className="inquiry-button">
                    <button type="button" className="thema-btn-01 my-inquiry-button">문의하기</button>
                </div>
            </div>
            <nav>
                <ul className="nav-list">
                    <li className="hover-li-selected flex-c"><a href="/" className="nav-list-link">FAQ</a></li>
                    <li className="hover-li"><a href="/" className="nav-list-link">상품 문의</a></li>
                    <li className="hover-li"><a href="/" className="nav-list-link">주문/결제</a></li>
                    <li className="hover-li"><a href="/" className="nav-list-link">반품/환불</a></li>
                    <li className="hover-li"><a href="/" className="nav-list-link">배송 문의</a></li>
                    <li className="hover-li"><a href="/" className="nav-list-link">기타</a></li>
                </ul>
            </nav>

            <div className="faq-list">
                {/* 첫 번째 질문 */}
                {faqs.map((faq, idx)=>(
                    <>
                <div className="faq-q flex-sb" key={faq.faqIdx}>
                    <div className="faq-q-head">
                        <p className="faq-q-logo">Q</p>
                        <p><span className="faq-q-start">[</span>&nbsp;취소/교환/반품&nbsp;<span>]</span></p>
                        <p>{faq.faqQ}</p>
                    </div>
                    <p><a href="/"><FontAwesomeIcon icon={faAngleUp} className="faq-expand-up"></FontAwesomeIcon></a></p>
                </div>
                <div className="faq-a flex-sb">
                    <div className="faq-a-head">
                        <p className="faq-a-logo">A</p>
                        <p>
                            {faq.faqA}
                        </p>
                    </div>
                </div>
                
                </>))}

                <div>
                    <a href="/" className="faq-expand">
                        더보기 <FontAwesomeIcon icon={faAngleDown} className="faq-expand-down"></FontAwesomeIcon>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default FaqComponent;

