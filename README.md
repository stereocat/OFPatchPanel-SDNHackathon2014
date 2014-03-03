## OFPatchPortal-SDNHackathon2014

SDN Hackathon at ONS 2014, Mar 2014
http://www.opennetsummit.org/sdn-hackathon.html

This application enables user to easily change physical connections between devices(Router,Switch,Server...etc) from GUI.

## Quick Start
### Ryu Application
Copy "ryu-app/patch_rest.py" to the directory of Ryu Controller and
start ryu-manager:

  % ryu-manager patch_rest.py

### GUI(HTML)
Start SimpleHTTPServer:

  % python -m SimpleHTTPServer 8000

Access to url of: "http://localhost:8000/index.html". 

## Team members
- Toru Furusawa
- Yoshinao Kurihara
- Masao Nishie