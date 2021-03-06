import React, { useCallback, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import useSWR from 'swr';

import useInput from '@hooks/useInput';
import fetcher from '@utils/fetcher';
import { Button, Error, Form, Header, Input, Label, LinkContainer } from '@pages/SignUp/styles';

const LogIn = () => {
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher, {
    dedupingInterval: 1000000,
  });
  const [logInError, setLogInError] = useState<boolean>(false);
  const [email, onChangeEmail] = useInput<string>('');
  const [password, onChangePassword] = useInput<string>('');
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);

      axios
        .post('http://localhost:3095/api/users/login', { email, password }, { withCredentials: true })
        .then((response) => {
          mutate(response.data, false);
        })
        .catch((error) => {
          setLogInError(error.response?.data?.statusCode === 401);
        });
    },
    [email, password],
  );

  if (data === undefined) {
    return <div> 로딩중 ... </div>;
  }

  if (data) {
    return <Redirect to="/workspace/channel" />;
  }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;
