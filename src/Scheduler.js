import React from 'react';
import toastr from 'toastr';
import {post, get} from 'axios';
import DateTimePicker from 'react-datetime-picker';


class Scheduler extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            file: null,
            message: '',
            pages : [],
            page : {id : '', name : ''}
        }
    }

    componentDidMount(){
        get('/pages').then((response) => {
            this.setState({
                pages : response.data
            });
        });
    }

    onDateChange(date) {
        this.setState({date})
    }

    onChange(e) {
        this.setState({message: e.target.value});
    }

    onFileChange(e) {
        if (this.validateFile(e.target.files[0])) {
            this.setState({file: e.target.files[0]})
        }
    }

    onPageSelect(e){
        if(e.target.value.length){
            this.setState({
                page : this.state.pages.filter(page => {
                    return page.id === e.target.value
                })[0]
            })
        }else{
            this.setState({
                page : {id : '', name : ''}
            })
        }

    }

    validateFile(file) {
        let allowed_types = ['image/jpeg', 'image/png'];
        if (!allowed_types.includes(file.type)) {
            toastr.error(file.type + ' mime type not supported. We only accept JPEG and PNG images', 'Invalid file type')
            return false;
        }
        return true;
    }

    schedulePost(e) {
        console.log(this.state);
        e.preventDefault();
        let error = false;
        if (!this.state.file && !this.state.message.length) {
            error = true;
            toastr.error(
                'To schedule post, please provide a message or image',
                'Please provide a message or image'
            );
        }

        if (!this.validateDate(this.state.date)) {
            error = true;
            toastr.error(
                'Scheduled date has already been passed, please select a valid date',
                'Invalid Date'
            );
        }

        if(!this.state.page.id.length){
            error = true;
            toastr.error(
                'Please select a page or profile from dropdown menu',
                'Page or Profile required'
            );
        }
        if (!error) {
            const formData = new FormData();
            formData.append('file', this.state.file);
            formData.append('message', this.state.message);
            formData.append('date', this.getDateInSeconds(this.state.date));
            formData.append('page_id', this.state.page.id);
            formData.append('page_name', this.state.page.name);
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            };
            console.log(formData);
            post('/schedule', formData, config).then((response) => {
                if(!response.data.error){
                    this.setState({
                        date: new Date(),
                        file: null,
                        message: '',
                    });
                    this.fileInput.value = '';
                    toastr.success('Post Scheduled');
                    this.props.addPost(response.data.post);
                }
            })
        }
    }

    validateDate(date) {
        let selected = (new Date(date).getTime() / 1000) - 10,
            current = new Date().getTime() / 1000;
        return selected > current;
    }

    getDateInSeconds(date){
        return Math.floor(new Date(date).getTime() / 1000);
    }

    render() {
        return (
            <div className="scheduler">
                <form onSubmit={this.schedulePost.bind(this)}>
                    <div className="form-group">
                        <label>
                            <h5>Message</h5>
                        </label>
                        <textarea value={this.state.message}
                                  onChange={this.onChange.bind(this)}
                                  className="form-control"
                                  rows="3"
                        />
                    </div>

                    <div className="row">
                        <div className="col-lg-4 col-md-4">
                            <div className="form-group">
                                <label>
                                    <h5>Image</h5>
                                </label>
                                <input type="file"
                                       name="file"
                                       className="form-control-file"
                                       ref={ref => (this.fileInput = ref)}
                                       onChange={this.onFileChange.bind(this)}
                                />
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-4">
                            <div className="form-group w-100">
                                <label htmlFor="exampleFormControlSelect1">
                                    <h5>
                                        Available Pages
                                    </h5>
                                </label>
                                <select
                                    className="form-control"
                                    value={this.state.page.id}
                                    onChange={this.onPageSelect.bind(this)}>
                                    <option value={''}>Select Page</option>
                                    {this.state.pages.map(page => {
                                        return (
                                            <option
                                                value={page.id}
                                                key={page.id}>
                                                {page.name}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-4">
                            <div className="form-group w-100">
                                <label>
                                    <h5>
                                        Publish Time
                                    </h5>
                                </label>
                                <div className="date-picker w-100">
                                    <DateTimePicker
                                        onChange={this.onDateChange.bind(this)}
                                        value={this.state.date}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group text-center">
                        <button type="submit" className="btn btn-dark align-content-center">
                            Schedule Post
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

export default Scheduler;
