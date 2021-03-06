/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3 Ignition
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_) {
	"use strict";
	module.exports = {
		properties: {
			location: {
				message: "At what file path should the site be created?",
				default: __dirname,
				required: true,
				callback: function (answer) {
					this.location = answer;
				}
			},
			codeStyle: {
				properties: {
					wrapper: {
						message: "Should the main site script be wrapped in an automatically invoked anonymous function?",
						default: "yes",
						required: true,
						validator: /^y(?:es)?|no?$/,
						callback: function (answer) {
							this.wrapper = /^y(?:es)?$/.test(answer);
						}
					},
					invocationStyle: {
						message: "Which invocation style do you prefer? ([c]hained, [d]iscrete)",
						default: "chained",
						required: true,
						validator: /^c(?:hained)?|d(?:iscrete)?$/,
						callback: function (answer) {
							this.chainedInvocation = /^c(?:hained)?$/.test(answer);
						}
					},
					comments: {
						message: "How should the generated code be commented? ([v]erbose, [m]inimal, [n]one",
						default: "verbose",
						required: true,
						validator: /^v(?:erbose)?|m(?:inimal)?|n(?:one)?$/,
						callback: function (answer) {
							if (/^v(?:erbose)?$/.test(answer)) {
								this.comments = 'verbose';
							} else if (/^m(?:inimal)$/.test(answer)) {
								this.comments = 'minimal';
							} else if (/^n(?:one)$/.test(answer)) {
								this.comments = 'none';
							}
						}
					}
				}
			},
			settings: {
				properties: {
					siteName: {
						message: "What is the site name?",
						default: "Anonymous Sitegear3 Website",
						required: true,
						callback: function (answer) {
							_.merge(this.settings, { site: { name: answer } });
						}
					},
					port: {
						message: "What port should the site run on?",
						validator: /^\\d{1,5}$/,
						callback: function (answer) {
							if (answer) {
								_.merge(this.settings, { server: { port: answer } });
							}
						}
					},
					baseUrl: {
						message: "What is the base URL of the website?",
						callback: function (answer) {
							if (answer) {
								_.merge(this.settings, { server: { baseUrl: answer } });
							}
						}
					}
				}
			},
			middleware: {
				properties: {
					logger: {
						message: "Do you want to use the logger middleware?",
						default: "yes",
						validator: /^y(?:es)?|no?$/,
						callback: function (answer) {
							if (/^y(?:es)?$/.test(answer)) {
								this.middleware.push("sitegear3.logger()");
							}
						}
					},
					compress: {
						message: "Do you want to use the compress middleware?",
						default: "yes",
						validator: /^y(?:es)?|no?$/,
						callback: function (answer) {
							if (/^y(?:es)?$/.test(answer)) {
								this.middleware.push("sitegear3.compress()");
							}
						}
					},
					cookieParser: {
						message: "Do you want to use the cookie parser middleware?",
						default: "yes",
						validator: /^y(?:es)?|no?$/,
						callback: function (answer) {
							if (/^y(?:es)?$/.test(answer)) {
								this.middleware.push("sitegear3.cookieParser()");
							}
						}
					},
					cookieSession: {
						message: "Do you want to use the cookie session middleware?",
						default: "yes",
						validator: /^y(?:es)?|no?$/,
						callback: function (answer) {
							if (/^y(?:es)?$/.test(answer)) {
								this.middleware.push("sitegear3.cookieSession(app.settings.session)");
							}
						}
					},
					csrf: {
						message: "Do you want to use the csrf middleware?",
						default: "yes",
						validator: /^y(?:es)?|no?$/,
						callback: function (answer) {
							if (/^y(?:es)?$/.test(answer)) {
								this.middleware.push("sitegear3.csrf()");
							}
						}
					},
					commonLocals: {
						message: "Do you want to use the common locals middleware?",
						default: "yes",
						validator: /^y(?:es)?|no?$/,
						callback: function (answer) {
							if (/^y(?:es)?$/.test(answer)) {
								this.middleware.push("sitegear3.commonLocals(app)");
							}
						}
					},
					viewHelpers: {
						message: "Do you want to use the view helpers middleware?",
						default: "yes",
						validator: /^y(?:es)?|no?$/,
						callback: function (answer) {
							if (/^y(?:es)?$/.test(answer)) {
								this.middleware.push("sitegear3.viewHelpers(app)");
							}
						}
					}
				}
			},
			rendering: {
				properties: {
					statics: {
						message: "What directory or directories do you wish to use to serve static content (images, client-side scripts, stylesheets, etc)?",
						default: "static",
						validator: /^(?:(?:[a-zA-Z0-9\-_]+)(?:\/(?:[a-zA-Z0-9\-_]+))*|(?:\/(?:[a-zA-Z0-9\-_]+))*:(?:[a-zA-Z0-9\-_]+)(?:\/(?:[a-zA-Z0-9\-_]+))*)(?:\|(?:[a-zA-Z0-9\-_]+)(?:\/(?:[a-zA-Z0-9\-_]+))*|(?:\/(?:[a-zA-Z0-9\-_]+))*:(?:[a-zA-Z0-9\-_]+)(?:\/(?:[a-zA-Z0-9\-_]+))*)*$/,
						callback: function (answer) {
							if (answer) {
								while (/^(?:[a-zA-Z0-9\-_]+)(?:\/(?:[a-zA-Z0-9\-_]+))*|(?:\/(?:[a-zA-Z0-9\-_]+))*:(?:[a-zA-Z0-9\-_]+)(?:\/(?:[a-zA-Z0-9\-_]+))*[\|\b]/.test(answer)) {
									if (/^(?:[a-zA-Z0-9\-_]+)(?:\/(?:[a-zA-Z0-9\-_]+))*/.test(answer)) {
										this.middleware.push("sitegear3.static(__dirname + '/" + answer.replace(/^((?:[a-zA-Z0-9\-_]+)(?:\/(?:[a-zA-Z0-9\-_]+))*)/, '$1') + "')");
									} else if (/(?:\/(?:[a-zA-Z0-9\-_]+))*:(?:[a-zA-Z0-9\-_]+)(?:\/(?:[a-zA-Z0-9\-_]+))*/.test(answer)) {
										this.middleware.push("sitegear3.static('" + answer.replace(/((?:\/(?:[a-zA-Z0-9\-_]+))*:(?:[a-zA-Z0-9\-_]+)(?:\/(?:[a-zA-Z0-9\-_]+))*)/, '$1') + "', __dirname + '/" + answer.replace(/((?:\/(?:[a-zA-Z0-9\-_]+))*:(?:[a-zA-Z0-9\-_]+)(?:\/(?:[a-zA-Z0-9\-_]+))*)/, '$2') + "')");
									}
									answer = answer.replace(/^(?:[a-zA-Z0-9\-_]+)(?:\/(?:[a-zA-Z0-9\-_]+))*|(?:\/(?:[a-zA-Z0-9\-_]+))*:(?:[a-zA-Z0-9\-_]+)(?:\/(?:[a-zA-Z0-9\-_]+))*[\|\b]/, '');
								}
							}
						}
					},
					templates: {
						message: "What directory do you wish to use for view scripts (templates)?",
						default: "templates",
						required: true,
						validator: /^(?:[a-zA-Z0-9\-_]+)(?:\/(?:[a-zA-Z0-9\-_]+))*$/,
						callback: function (answer) {
							this.templatesPath = answer;
						}
					},
					engine: {
						message: "Which rendering engine do you wish to use?",
						default: "swig",
						validator: /^swig|none$/,
						callback: function (answer) {
							switch (answer) {
								case 'swig':
									this.engine = "'html', swig.renderFile";
									this.sets.push("'view engine', 'html'");
									this.sets.push("'views', __dirname + '/" + this.templatesPath + "'");
									break;
							}
						}
					},
					routes: {
						message: "Do you want to set up the default routing middleware?",
						default: "yes",
						validator: /^y(?:es)?|no?$/,
						callback: function (answer) {
							if (/^y(?:es)?$/.test(answer)) {
								this.middleware.push("sitegear3.pageRouter(__dirname + '/" + this.templatesPath + "')");
								this.middleware.push("sitegear3.notFound()");
								this.middleware.push("sitegear3.internalServerError()");
							}
						}
					}
				}
			}
		}
	};
}(require('lodash')));
