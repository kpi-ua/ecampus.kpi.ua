import React from 'react'
import '../../css/Mail.css';

const MessagesIndex = () =>
  <div className="row">
    <div className="col-md-12">
      <h1>Повідомлення</h1>
      <div className="row">
           <div className="col-sm-3">
            <a href="mail-compose.html" className="btn btn-danger btn-block btn-compose-email">Compose Email</a>
            <ul className="nav nav-pills nav-stacked nav-email shadow mb-20">
              <li className="active">
                <a href="#mail-inbox.html">
                  <i className="fa fa-inbox"></i> Inbox <span className="label pull-right">7</span>
                </a>
              </li>
              <li>
                <a href="#mail-compose.html"><i className="fa fa-envelope-o"></i> Send Mail</a>
              </li>
              <li>
                <a href="#"><i className="fa fa-certificate"></i> Important</a>
              </li>
              <li>
                <a href="#">
                  <i className="fa fa-file-text-o"></i> Drafts <span
                  className="label label-info pull-right inbox-notification">35</span>
                </a>
              </li>
              <li><a href="#"> <i className="fa fa-trash-o"></i> Trash</a></li>
            </ul>


            <h5 className="nav-email-subtitle">More</h5>
            <ul className="nav nav-pills nav-stacked nav-email mb-20 rounded shadow">
              <li>
                <a href="#">
                  <i className="fa fa-folder-open"></i> Promotions <span
                  className="label label-danger pull-right">3</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fa fa-folder-open"></i> Job list
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fa fa-folder-open"></i> Backup
                </a>
              </li>
            </ul>

          </div>
          <div className="col-sm-9">
            <div className="panel rounded shadow panel-teal">
              <div className="panel-heading">
                <div className="pull-left">
                  <h3 className="panel-title">Inbox (7)</h3>
                </div>
                <div className="pull-right">
                  <form action="#" className="form-horizontal mr-5 mt-3">
                    <div className="form-group no-margin no-padding has-feedback">
                      <input type="text" className="form-control no-border" placeholder="Search mail" />
                        <button type="submit" className="btn btn-theme fa fa-search form-control-feedback"></button>
                    </div>
                  </form>
                </div>
                <div className="clearfix"></div>
              </div>

              <div className="panel-sub-heading inner-all">
                <div className="pull-left">
                  <ul className="list-inline no-margin">
                    <li>
                      <div className="ckbox ckbox-theme">
                        <input id="checkbox-group" type="checkbox" className="mail-group-checkbox" />
                          <label htmlFor="checkbox-group"></label>
                      </div>
                    </li>
                    <li>
                      <div className="btn-group">
                        <button type="button" className="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown">
                          All <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu" role="menu">
                          <li><a href="#">None</a></li>
                          <li><a href="#">Read</a></li>
                          <li><a href="#">Unread</a></li>
                        </ul>
                      </div>
                    </li>
                    <li>
                      <div className="btn-group">
                        <button className="btn btn-default btn-sm tooltips" type="button" data-toggle="tooltip"
                                data-container="body" title="" data-original-title="Archive"><i
                          className="fa fa-inbox"></i></button>
                        <button className="btn btn-default btn-sm tooltips" type="button" data-toggle="tooltip"
                                data-container="body" title="" data-original-title="Report Spam"><i
                          className="fa fa-warning"></i></button>
                        <button className="btn btn-default btn-sm tooltips" type="button" data-toggle="tooltip"
                                data-container="body" title="" data-original-title="Delete"><i
                          className="fa fa-trash-o"></i></button>
                      </div>
                    </li>
                    <li className="hidden-xs">
                      <div className="btn-group">
                        <button type="button" className="btn btn-default btn-sm">More</button>
                        <button type="button" className="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown">
                          <span className="caret"></span>
                          <span className="sr-only">Toggle Dropdown</span>
                        </button>
                        <ul className="dropdown-menu" role="menu">
                          <li><a href="#"><i className="fa fa-edit"></i> Mark as read</a></li>
                          <li><a href="#"><i className="fa fa-ban"></i> Spam</a></li>
                          <li className="divider"></li>
                          <li><a href="#"><i className="fa fa-trash-o"></i> Delete</a></li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="pull-right">
                  <ul className="list-inline no-margin">
                    <li className="hidden-xs"><span className="text-muted">Showing 1-50 of 2,051 messages</span></li>
                    <li>
                      <div className="btn-group">
                        <a href="#" className="btn btn-sm btn-default"><i className="fa fa-angle-left"></i></a>
                        <a href="#" className="btn btn-sm btn-default"><i className="fa fa-angle-right"></i></a>
                      </div>
                    </li>
                    <li className="hidden-xs">
                      <div className="btn-group">
                        <button type="button" className="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown">
                          <i className="fa fa-cog"></i> <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu pull-right" role="menu">
                          <li className="dropdown-header">Display density :</li>
                          <li className="active"><a href="#">Comfortable</a></li>
                          <li><a href="#">Cozy</a></li>
                          <li><a href="#">Compact</a></li>
                          <li className="dropdown-header">Configure inbox</li>
                          <li><a href="#">Settings</a></li>
                          <li><a href="#">Themes</a></li>
                          <li className="divider"></li>
                          <li><a href="#">Help</a></li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="clearfix"></div>
              </div>

              <div className="panel-body no-padding">

                <div className="table-responsive">
                  <table className="table table-hover table-email">
                    <tbody>
                    <tr className="unread selected">
                      <td>
                        <div className="ckbox ckbox-theme">
                          <input id="checkbox1" type="checkbox" checked="checked" className="mail-checkbox" />
                            <label htmlFor="checkbox1"></label>
                        </div>
                      </td>
                      <td>
                        <a href="#" className="star star-checked"><i className="fa fa-star"></i></a>
                      </td>
                      <td>
                        <div className="media">
                          <a href="#" className="pull-left">
                            <img alt="..." src="https://bootdey.com/img/Content/avatar/avatar1.png" className="media-object" />
                          </a>
                          <div className="media-body">
                            <h4 className="text-primary">John Kribo</h4>
                            <p className="email-summary"><strong>Commits pushed</strong> Lorem ipsum dolor sit amet,
                              consectetur adipisicing elit... <span className="label label-success">New</span></p>
                            <span className="media-meta">Today at 6:16am</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="ckbox ckbox-theme">
                          <input id="checkbox2" type="checkbox" className="mail-checkbox" />
                            <label htmlFor="checkbox2"></label>
                        </div>
                      </td>
                      <td>
                        <a href="#" className="star"><i className="fa fa-star"></i></a>
                      </td>
                      <td>
                        <div className="media">
                          <a href="#" className="pull-left">
                            <img alt="..." src="https://bootdey.com/img/Content/avatar/avatar2.png"
                                 className="media-object" />
                          </a>
                          <div className="media-body">
                            <h4 className="text-primary">Jennifer Poiyem</h4>
                            <p className="email-summary"><strong>Send you gift</strong> Sed do eiusmod tempor
                              incididunt...<span className="label label-success">New</span></p>
                            <span className="media-meta">Today at 1:13am</span>
                            <span className="media-attach"><i className="fa fa-paperclip"></i></span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="unread">
                      <td>
                        <div className="ckbox ckbox-theme">
                          <input id="checkbox3" type="checkbox" checked="checked" className="mail-checkbox" />
                            <label htmlFor="checkbox3"></label>
                        </div>
                      </td>
                      <td>
                        <a href="#" className="star star-checked"><i className="fa fa-star"></i></a>
                      </td>
                      <td>
                        <div className="media">
                          <a href="#" className="pull-left">
                            <img alt="..." src="https://bootdey.com/img/Content/avatar/avatar3.png"
                                 className="media-object" />
                          </a>
                          <div className="media-body">
                            <h4 className="text-primary">Clara Wati</h4>
                            <p className="email-summary"><strong>Follow you</strong> Ut enim ad minim veniam, quis
                              nostrud exercitation... </p>
                            <span className="media-meta">Jul 02</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="ckbox ckbox-theme">
                          <input id="checkbox4" type="checkbox" className="mail-checkbox" />
                            <label htmlFor="checkbox4"></label>
                        </div>
                      </td>
                      <td>
                        <a href="#" className="star"><i className="fa fa-star"></i></a>
                      </td>
                      <td>
                        <div className="media">
                          <a href="#" className="pull-left">
                            <img alt="..." src="https://bootdey.com/img/Content/avatar/avatar4.png"
                                 className="media-object" />
                          </a>
                          <div className="media-body">
                            <h4 className="text-primary">Toni Mriang</h4>
                            <p className="email-summary"><strong>Check out new template</strong> Laboris nisi ut aliquip
                              ex ea commodo consequat... <span className="label label-warning">Urgent</span></p>
                            <span className="media-meta">Jul 02</span>
                            <span className="media-attach"><i className="fa fa-paperclip"></i><i
                              className="fa fa-share"></i></span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="selected">
                      <td>
                        <div className="ckbox ckbox-theme">
                          <input id="checkbox5" type="checkbox" checked="checked" className="mail-checkbox" />
                            <label htmlFor="checkbox5"></label>
                        </div>
                      </td>
                      <td>
                        <a href="#" className="star star-checked"><i className="fa fa-star"></i></a>
                      </td>
                      <td>
                        <div className="media">
                          <a href="#" className="pull-left">
                            <img alt="..." src="https://bootdey.com/img/Content/avatar/avatar5.png"
                                 className="media-object" />
                          </a>
                          <div className="media-body">
                            <h4 className="text-primary">Bella negoro</h4>
                            <p className="email-summary"><strong>Monthly sales report</strong> Excepteur sint occaecat
                              cupidatat non proident... </p>
                            <span className="media-meta">Jul 02</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="unread">
                      <td>
                        <div className="ckbox ckbox-theme">
                          <input id="checkbox6" type="checkbox" className="mail-checkbox" />
                            <label htmlFor="checkbox6"></label>
                        </div>
                      </td>
                      <td>
                        <a href="#" className="star"><i className="fa fa-star"></i></a>
                      </td>
                      <td>
                        <div className="media">
                          <a href="#" className="pull-left">
                            <img alt="..." src="https://bootdey.com/img/Content/avatar/avatar6.png" className="media-object" />
                          </a>
                          <div className="media-body">
                            <h4 className="text-primary">Kim Mbako</h4>
                            <p className="email-summary"><strong>1 New job</strong> Sed ut perspiciatis unde omnis iste
                              natus error sit voluptatem... <span className="label label-danger">Promotion</span></p>
                            <span className="media-meta">Jul 01</span>
                            <span className="media-attach"><i className="fa fa-paperclip"></i></span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="ckbox ckbox-theme">
                          <input id="checkbox7" type="checkbox" className="mail-checkbox" />
                            <label htmlFor="checkbox7"></label>
                        </div>
                      </td>
                      <td>
                        <a href="#" className="star"><i className="fa fa-star"></i></a>
                      </td>
                      <td>
                        <div className="media">
                          <a href="#" className="pull-left">
                            <img alt="..." src="https://bootdey.com/img/Content/avatar/avatar6.png" className="media-object" />
                          </a>
                          <div className="media-body">
                            <h4 className="text-primary">Pack Suparman</h4>
                            <p className="email-summary"><strong>You sold a item!</strong> Ut enim ad minim veniam, quis
                              nostrud exercitation... </p>
                            <span className="media-meta">Jul 01</span>
                            <span className="media-attach"><i className="fa fa-users"></i></span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="ckbox ckbox-theme">
                          <input id="checkbox8" type="checkbox" className="mail-checkbox" />
                            <label htmlFor="checkbox8"></label>
                        </div>
                      </td>
                      <td>
                        <a href="#" className="star"><i className="fa fa-star"></i></a>
                      </td>
                      <td>
                        <div className="media">
                          <a href="#" className="pull-left">
                            <img alt="..." src="https://bootdey.com/img/Content/avatar/avatar6.png" className="media-object" />
                          </a>
                          <div className="media-body">
                            <h4 className="text-primary">Jeddy Mentri</h4>
                            <p className="email-summary"><strong>IOS Developer</strong> Ut enim ad minim veniam, quis
                              nostrud exercitation... </p>
                            <span className="media-meta">Jun 25</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="ckbox ckbox-theme">
                          <input id="checkbox9" type="checkbox" className="mail-checkbox"/>
                            <label htmlFor="checkbox9"></label>
                        </div>
                      </td>
                      <td>
                        <a href="#" className="star"><i className="fa fa-star"></i></a>
                      </td>
                      <td>
                        <div className="media">
                          <a href="#" className="pull-left">
                            <img alt="..." src="https://bootdey.com/img/Content/avatar/avatar1.png" className="media-object" />
                          </a>
                          <div className="media-body">
                            <h4 className="text-primary">Daddy Botak</h4>
                            <p className="email-summary"><strong>User interface Status</strong> Ut enim ad minim veniam,
                              quis nostrud exercitation... </p>
                            <span className="media-meta">Jun 23</span>
                            <span className="media-attach"><i className="fa fa-paperclip"></i></span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="unread">
                      <td>
                        <div className="ckbox ckbox-theme">
                          <input id="checkbox10" type="checkbox" className="mail-checkbox" />
                            <label htmlFor="checkbox10" />
                        </div>
                      </td>
                      <td>
                        <a href="#" className="star"><i className="fa fa-star" /></a>
                      </td>
                      <td>
                        <div className="media">
                          <a href="#" className="pull-left">
                            <img alt="..." src="https://bootdey.com/img/Content/avatar/avatar6.png" className="media-object"/>
                          </a>
                          <div className="media-body">
                            <h4 className="text-primary">Sarah Tingting</h4>
                            <p className="email-summary"><strong>Java Developer + 2 new jobs</strong> Nemo enim ipsam
                              voluptatem quia voluptas sit aspernatur... </p>
                            <span className="media-meta">Jun 05</span>
                            <span className="media-attach"><i className="fa fa-warning" /></span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>


              </div>

            </div>
          </div>
        </div>
    </div>
  </div>;


export default MessagesIndex
