import React from 'react';
import { useForm, useWatch } from 'react-hook-form'
import apiClient from '../apiClient';
import { useNavigate } from 'react-router-dom'
function NewArticle() {
  const { register, handleSubmit, control, formState: { error, isValid } } = useForm({ mode: 'onChange' });
  const navigate = useNavigate();
  const onFormSubmit = async (data) => {
    const tagList = data.tags ? data.tags.split(',').map(t => t.trim()).filter(t => t) : [];
    const requestBody = {
      article: {
        title: data.title,
        description: data.description,
        body: data.body,
        tagList: tagList
      }
    }
    try {
      const { data: { article } } = await apiClient.post('/articles', requestBody);
      navigate(`/article/${article.slug}`);
    }
    catch (error) {
      console.log(error);
    }
  }
  const display = ({ control, name }) => {
    const value = useWatch({ control, name, defaultValue: "" });
    const tags = typeof value === 'string'
      ? value.split(',').map(t => t.trim()).filter(t => t)
      : [];
    return (
      <div className="tag-list">
        {tags.map((tag, index) => (
          <span key={index} className="tag-default tag-pill">
            <i className="ion-close-round"></i> {tag}
          </span>
        ))}
      </div>
    );
  };
  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                    {...register('title', { required: true })}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="What's this article about?"
                    {...register('description', { required: true })}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows="8"
                    placeholder="Write your article (in markdown)"
                    {...register('body', { required: true })}
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter tags"
                    {...register('tags', { required: true })}
                  />
                  use , to switch tags
                </fieldset>
                <div>
                  {display({ control, name: 'tags' })}
                </div>
                <button
                  className="btn btn-lg pull-xs-right btn-primary"
                  type="submit"
                  disabled={!isValid}
                >
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default NewArticle;