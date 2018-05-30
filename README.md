 webapp_phase5

Readme Introduction

 1. Name of your Application: Find me a place in NY

 2. Keywords
Safety, home affordability and distance close to New York University

3. Description of the datasets and function design
 * [name] [link] [data type] [data columns used] [data amount] Please provide a name+link+basicInfo to each dataset you have used.
  GEOSHAPEDISTRICT ="http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";
 NEIGHBORHOOD_NAMES_URL = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
 CRIMES_URL = "https://data.cityofnewyork.us/resource/9s4h-37hy.json?cmplnt_fr_dt=2015-12-31T00:00:00.000";
HOUSING_URL = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";
 MUSUEUMS_URL = "https://data.cityofnewyork.us/api/views/fn6f-htvy/rows.json?accessType=DOWNLOAD";
 ARTGALL_URL = "https://data.cityofnewyork.us/api/views/43hw-uvdj/rows.json?accessType=DOWNLOAD";
 FARMMAR_URL ="https://data.cityofnewyork.us/api/views/j8gx-kc43/rows.json?accessType=DOWNLOAD";


4. Brief Description

 * Use a paragraph to introduce your project.

 Fill in the structued description:
 * Map View:
	1. [Y] Basic Map with specific location (your map is located in a meaningful place, city of west lafayette for example)
	1. [Y] [describe] Any cover on the map (for example, cloud cover to show the weather effect)

 * Data Visualization:
	1. [N] [describe] Use Graph? What is the type? (bar chart, pie chart, radar chart ...)
	2. [Y] [List] Any interaction available on the graph? List them (enable click on numbers, drag on lines, change time/variables ...)
	
 * Interaction Form:
	1. [Y] [List] Any information output? list them. (text field, text area, label, plain HTML ...)
	2. [N] [List] Any operation option (filters)? List them. (search markets, search vegetables, filter based on price, sort based on convenience ...)
	3. [Y] [List] Any information input? List them. (comments, markers, user preference ...)
	4. [Y] [List] Interaction with Map? List them. (filter on price will affect map markers, sort on price will affect map markers, ...)
	5. [N] [List] Interaction with data visualization? List them. (filter, sort, set variables ...)

##6. Test Case
 Chrome and Firefox

##7. Additional information You Want to Share with Us
E.g. any problems you faced/fixed, where you reached out to for help, etc.

Please follow the instructions because the user load the data 
The data reference for crime can take 30 seconds for load
