# ArcGIS JavaScript Print Widget

----
This is a Dojo print widget for [ArcGIS JavaScript](http://developers.arcgis.com/en/javascript/).

Will use a Print service to generate a PDF of the map.

Sample config:

````javascript
{
  "name": "print",
  "path": "widgets/print/print",
  "options": {
    "printUrl": "http://<hostname>/arcgis/rest/services/<services>/GPServer/Export%20Web%20Map",
    "printParams": {
      "async": true
    }
  }
}
````

*A work in progress*
