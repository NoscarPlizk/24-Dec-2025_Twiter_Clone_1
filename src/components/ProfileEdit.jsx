import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from 'react-bootstrap';

export default function ProfileEdit() {
  return (
    <>
      <Form>
        <Form.Group>
          <Form.Label>
            New bio 
          </Form.Label>
          <Form.Control type="text" placeholder="New Bio Info"/>
        </Form.Group>
        <Form.Group>
          <Form.Label>
            Profile Picture
          </Form.Label>
          <Form.Control type="file" />
        </Form.Group>
      </Form>
    </>
  );
}