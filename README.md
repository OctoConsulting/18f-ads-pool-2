# GSA Agile Delivery Services (ADS I) RFQ# 4QTFHS150004 #
## Octo Consulting Group ##
## Response to Pool 2: Development ##

<p align="center">
  <img src="https://github.com/OctoConsulting/18f-ads-pool-2/blob/master/docs/Images/medsearch%20logo.png?raw=true">
</p>
 
Prototype URL: 
<https://medsearch.octoconsulting.com>

Deployment Instructions:
<https://github.com/OctoConsulting/18f-ads-pool-2/blob/master/docs/deployment-instructions.md>

# Introduction #
MedSearch is a responsive application developed by Octo Consulting Group (Octo) in response to the solicitation released by 18F for Agile Delivery Services. MedSearch leverages fda.gov APIs and provides a listing of adverse events and recalls of drugs. Octo used a user-centric and agile-delivery approach in delivering MedSearch across multiple releases. Key highlights of our approach include:
*             Use of Scrum to manage backlog and delivery of development
*             Use of Kanban to manage backlog for DevOps
*             Use of docker containers, docker hub and Jenkins to automate continuous integration and delivery
 
# Description of Our Approach #
The following diagram outlines our approach for responding to the solicitation:
 
![Image of MedCheck](https://github.com/OctoConsulting/18f-ads-pool-3/blob/master/docs/images/approach.png?raw=true)
 
## Planning Phase ##
Octo assembled a team of experienced agile experts, developers, analysts and devops engineers. A group of employees served as "users" during the development of the prototype, and reviewed FDA APIs to craft an initial problem statement that served as the scope for the project team.
 
## Agile Development Phase ##
### Sprint #0 (Planning) ###
The team reviewed the problem statement and analyzed datasets to understand the API and data, which drove the architecture definition and development of initial user experience artifacts.  An open, modern technology stack was selected and the devops team stood up the initial development, integration and production environments. 
 
The team also performed the following during this sprint:
* Identified high-level features required to meet user needs
* Decomposed features into user and technical stories that could be completed in a single sprint
* Created a product vision and roadmap for delivery of features in multiple releases (Link)
 
### Sprint #1..N (Sprinting) ###
The prototype was iteratively built using an Agile approach; the development team using Scrum while the DevOps team using Kanban to ensure they stay ahead of the development team. The team initially planned for 3 production releases of the prototype. Features were planned for each Release, and individual stories for each feature were slotted in sprints within each Release (Links to pictures). The team made adjustments to the product based on user feedback after each demonstration and by collaborating with the users while working within the constraints imposed by the APIs.
 
User stories were documented in a product backlog, with multiple versions reflecting the changing features identified by our users (Link to backlog). The team planned stories to be completed in each sprint, estimated story points, and reviewed completed stories with the Product Manager. At the end of each sprint, a product demo was conducted, feedback collected, product deployed to production, and a sprint review and retrospective completed (Link to retrospectives).  All user and design documentation necessary for the execution of the sprint was constantly updated.
 
#### Technical Approach ####
Node.js and Loopback frameworks were selected as the primary stack for the service layer with Angular.js and Bootstrap serving as the front-end frameworks. Angular.js based front-end exchanged data with Loopback based service layer using secure Restful services with json as the primary data exchange format (Link for Architecture Diagram).
 
Karma test framework was used to write test cases for the front-end and a combination of Mocha, Supertest and Should were used to write test cases for the service layer. All test cases were automatically executed when new code was checked into the repository via a Jenkins hook for GitHub.  Once all test cases passed, the Jenkins-based automated build and promotion script deployed the code to the integration server. The DevOps team used Docker and Chef to code the infrastructure, and the prototype was deployed within a Docker container available publicly on Docker Hub. The integration and production environments were deployed on AWS EC2 instances.
 
Nagios was used to monitor the health of the infrastructure and the deployed prototype code.  Automatic email alerts were sent to the administrator when predetermined thresholds on response time, concurrent users, disk usage, or server load are exceeded. (Links to screenshots)
 
<p align="center">
<img src="https://github.com/OctoConsulting/18f-ads-pool-3/blob/master/docs/images/techstack.png?raw=true">
</p>
 
### Sprint #X (Hardening) ###
 
The team performed final field testing to ensure the application met user needs and conducted usability testing with a broader set of Octo employees. The DevOps team developed final deployment documentation.
 
## Closeout Phase ##
 
The team closed out the execution of the prototype by completing the documentation necessary for submitting the solicitation response to the government.
 
## RFQ Section 24.0 Factor 1: Technical Approach ##
*   Evidence to Digital Services Playbook - See Repository for Artifacts
*   Criteria A through K – See Attachment E Approach Criteria Evidence for Pool 2

# Alignment to Digital Services Playbook #

<https://github.com/OctoConsulting/18f-ads-pool-2/blob/master/docs/DSP%20Alignment.xlsx>
