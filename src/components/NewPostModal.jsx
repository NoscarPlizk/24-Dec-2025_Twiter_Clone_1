import axios from "axios";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { savePost } from "../features/posts/postsSlice";

export default function NewPostModal({ show, handleClose }) {
  const [postContent, setPostContent] = useState("");
  const dispatch = useDispatch();

  const handleSave = () => {

    
    const token = localStorage.getItem("authToken");
    const decode = jwtDecode(token);
    const userId = decode.id

    const data = {
      title: "Post Title",
      content: postContent,
      user_id: userId,
    };

    axios.post("https://f92bb0f6-ffb4-4823-a9e9-7395f774ed9c-00-vzoe863hxodo.sisko.replit.dev/posts", data)
    .then((response) => {
      console.log("success:", response.data);
      handleClose();
    })
    .catch((error) => {
      console.error("Error", error);
    });
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="postContent">
              <Form.Control 
                placeholder="What is happening?!"
                as="textarea"
                rows={3}
                onChange={(e) => setPostContent(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="rounded-pill"
            onClick={handleSave}
          >
            Tweet
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}