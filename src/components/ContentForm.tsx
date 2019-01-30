import * as React from "react";
import { render } from "react-dom";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { Form, Button, Row, Col } from "antd";
const FormItem = Form.Item;
// import "./styles.css";

class ContentForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      editorState: EditorState.createEmpty(),
      htmlContent: "",
      tags: [],
      inputVisible: false,
      inputValue: ""
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
      }
    });
  };

  onEditorStateChange = editorState => {
    this.setState(
      {
        editorState,
        htmlContent: draftToHtml(convertToRaw(editorState.getCurrentContent()))
      },
      // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
      console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
    );
  };

  uploadImageCallBack = file => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/posts/upload");
      xhr.setRequestHeader("Authorization", "Client-ID XXXXX");
      const data = new FormData();
      data.append("image", file);
      xhr.send(data);
      xhr.addEventListener("load", () => {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      });
      xhr.addEventListener("error", () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { errors, editorState } = this.state;
    const { tags, inputVisible, inputValue } = this.state;
    return (
      <div>
        <Form>
          <FormItem label="内容">
            <Row gutter={8}>
              <Col span={12}>
                {getFieldDecorator("post", {
                  rules: []
                })(
                  <Editor
                    editorState={editorState}
                    wrapperClassName="wrapper"
                    editorClassName="editor"
                    editorStyle={{ border: "1px solid #f1f1f1" }}
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={{
                      inline: { inDropdown: true },
                      list: { inDropdown: true },
                      textAlign: { inDropdown: true },
                      link: { inDropdown: true },
                      history: { inDropdown: true },
                      image: {
                        uploadCallback: this.uploadImageCallBack,
                        alt: { present: true, mandatory: true }
                      }
                    }}
                  />
                )}
              </Col>
              <Col span={12} />
            </Row>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              onClick={this.handleSubmit}
            >
              提交
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(ContentForm);
