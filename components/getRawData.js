import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '../utils/supabaseClient'
import DataTable from 'react-data-table-component';

import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { Controller, useForm } from 'react-hook-form';

import styles from '../styles/components/playerData.module.scss';
import { customRDTStyles, specificRDTStyles } from '../styles/components/dataTable';

// -------------- Data Table Variables -------------- //
const dataColWidth01 = "76px";
const dataColWidth02 = "100px";
let tableData = {};
let finalTableData;
let columns = [];
let dataSource;
const allCats = [
    'G', 'A', 'PTS', '+/-', 'PIM', 
    'SOG', 'PPP', 'PPG', 'PPA', 'SHP', 
    'SHG', 'SHA', 'FOW', 'FOL', 'GWG', 
    'HIT', 'BLK', 'GS', 'W', 'L', 
    'GA', 'GAA', 'SA', 'SV', 'SV%', 
    'SO'
]
// -------------- END of Data Table Variables -------------- //

export default function PlayerRawData(props) {
    const [playerData, setPlayerData] = useState([])
    const [showPerGP, setShowPerGP] = useState(false);
    const [loading, setLoading] = useState()


    const { register, watch, control, reset, handleSubmit, errors } = useForm();
    let tablePosFilter = watch("tablePosFilter");
    let season = watch("seasonSelect");
    let seasonID = season;
    seasonID = '21-22'  // Default
    let league = 'NHL';

    const wait = delay => new Promise(resolve => setTimeout(resolve, delay));

    // Checks if lsID value is different than previous value
    const onRefChange = useCallback(
        (node) => {
            // console.log(node);
            return true;
        },
        [season]
    );

    const checkIfNewDataNecessary = () => {
        // 1. Check if season has changed
        if (onRefChange()) {
          // 2. Check if season is valid, and if seasonID is valid
          if ((seasonID == "") || (seasonID.length > 5) || (seasonID.length <= 4) || (typeof seasonID == 'undefined')) {
            return false
          } else {
            // 3. Check if that lsID's season data already exists
            if (tableData[season] == null) {
              return true
            } else {
              setTableData()
              return false
            }
          }
        } else {
          return false
        }
      }

    async function fetchPlayerData() {

        // Check if we have cached data
        // let cacheEntry = await redis.get(`playerData`)
        // let cacheData = {}
        // if (cacheEntry) {
        //   console.log(cacheEntry)
        //   cacheData = cacheEntry;
        //   dataSource = 'redis'
        //   return cacheData;
        // }
  
        console.log('fetching data from server')
        let dbFile = league + '_allPlayers_' + seasonID;
        console.log("db file = " + dbFile)
  
        // ------------- TODO: Add REDIS cache here (or some other simple cache) in order to save on server calls
  
        const { data, error } = await supabase
          .from(dbFile)
          .select()
          // .range(0, 200)
          .then( dataSource = 'API' )
          // .then(data => {    // THIS FIRES TOO EARLY - DATA HASN'T BEEN LOADED
          //   setPlayerData(data)
          // })
        if (error) {
          console.log('error')
          console.log(error.message)
          return data;  // abort
        }
        
        return data;
    }

    const setTableData = async (data) => {
        setLoading(true)
        // console.log('setTableData');
        console.log(`setting tableData[${season}]`)
        finalTableData = []; // clear specific subset of data to display
    
        // data.Source = dataSource;
        // console.log('Data was pulled from: ' + data.Source + ' and took ' + data.responseTime)
        
        // If season data doesn't exist locally yet, set season data
        if (typeof tableData[season] == 'undefined') {
          tableData[season] = data
        }
    
        if (tablePosFilter == 'None') {
          finalTableData = tableData[season]
        } else {
          finalTableData = tableData[season].filter(player => player.PositionAll == tablePosFilter);
        }
        
        await wait(1000);
    
        setTableCols()
        setLoading(false);
    
        console.log(finalTableData)
    }
    
    const setTableCols = () => {
        let columnData = []
        let x = 0;
        for (let cat in allCats) {
            columnData[x] = {
                'name': allCats[cat],
                'dataRef1' : allCats[cat],
                'dataRef2' : `${allCats[cat]} perGP`,
                'omitTotal' : showPerGP,
                'omitperGP' : !showPerGP,
            }

            x += 1
        }

        console.log(columnData)

        columns = [
            {
                name: 'Name',
                selector: row => row['Full Name'],
                sortable: false,
                width: '170px',
                style: {
                  justifyContent: 'left',
                  borderRight: "1px dotted #616161"
                }
            },
            {
                name: 'Team',
                selector: row => row.Team,
                sortable: false,
                width: "80px",
                style: {
                    textTransform: 'uppercase',
                    borderRight: "1px dotted #616161"
                }
            },
            {
                name: 'Pos',
                selector: row => row.PositionAll,
                sortable: false,
                width: '85px',
                style: {
                  color: 'black',
                  fontSize: '14px',
                  fontWeight: '600',
                  borderRight: "1px dotted #616161"
                },
                conditionalCellStyles: [
                    {
                      when: row => row.PositionAll == 'C',
                      style: {
                        backgroundColor: '#93d274',
                      }
                    },
                    {
                      when: row => row.PositionAll == 'LW',
                      style: {
                        backgroundColor: '#f5df72',
                      }
                    },
                    {
                      when: row => row.PositionAll == 'RW',
                      style: {
                        backgroundColor: '#ff6963',
                      }
                    },
                    {
                      when: row => row.PositionAll == 'D',
                      style: {
                        backgroundColor: '#7bb3d6',
                      }
                    },
                    {
                      when: row => row.PositionAll == 'G',
                      style: {
                        backgroundColor: '#b875c8',
                      } 
                    },
                    {
                    when: row => (row.PositionAll == 'C, LW' || row.PositionAll == 'LW, RW' || row.PositionAll == 'C, RW' || row.PositionAll == 'C, LW, RW'),
                      style: {
                        backgroundColor: '#ffab44',
                      } 
                    },  
                ]
            },
            {
                name: "GP",
                selector: row => row.GP,
                sortable: true,
                width: '80px',
                style: {
                    fontSize: '0.9rem',
                    justifyContent: 'center',
                    borderRight: "1px dotted #616161"
                }
            },
            {
                name: columnData[0]['name'],
                selector: row => row[columnData[0]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[0]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
            },
            {
                name: columnData[0]['name'],
                selector: row => row[columnData[0]['dataRef2']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[0]['omitperGP'],
                style: {
                    borderRight: "1px dotted #616161"
                }
            },
            {
                name: columnData[1]['name'],
                selector: row => row[columnData[1]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[1]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
            },
            {
                name: columnData[1]['name'],
                selector: row => row[columnData[1]['dataRef2']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[1]['omitperGP'],
                style: {
                    borderRight: "1px dotted #616161"
                }
            },
            {
                name: columnData[2]['name'],
                id: 'InitialSort',
                selector: row => row[columnData[2]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[2]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[2]['name'],
                selector: row => row[columnData[2]['dataRef2']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[2]['omitperGP'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[3]['name'],
                selector: row => row[columnData[3]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[3]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[3]['name'],
                selector: row => row[columnData[3]['dataRef2']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[3]['omitperGP'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[4]['name'],
                selector: row => row[columnData[4]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[4]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[4]['name'],
                selector: row => row[columnData[4]['dataRef2']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[4]['omitperGP'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[5]['name'],
                selector: row => row[columnData[5]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[5]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[5]['name'],
                selector: row => row[columnData[5]['dataRef2']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[5]['omitperGP'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[6]['name'],
                selector: row => row[columnData[6]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[6]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[6]['name'],
                selector: row => row[columnData[6]['dataRef2']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[6]['omitperGP'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[7]['name'],
                selector: row => row[columnData[7]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[7]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[7]['name'],
                selector: row => row[columnData[7]['dataRef2']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[7]['omitperGP'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[8]['name'],
                selector: row => row[columnData[8]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[8]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[8]['name'],
                selector: row => row[columnData[8]['dataRef2']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[8]['omitperGP'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[9]['name'],
                selector: row => row[columnData[9]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[9]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[9]['name'],
                selector: row => row[columnData[9]['dataRef2']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[9]['omitperGP'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[10]['name'],
                selector: row => row[columnData[10]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[10]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[10]['name'],
                selector: row => row[columnData[10]['dataRef2']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[10]['omitperGP'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[11]['name'],
                selector: row => row[columnData[11]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[11]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[11]['name'],
                selector: row => row[columnData[11]['dataRef2']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[11]['omitperGP'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[12]['name'],
                selector: row => row[columnData[12]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[12]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[12]['name'],
                selector: row => row[columnData[12]['dataRef2']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[12]['omitperGP'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[13]['name'],
                selector: row => row[columnData[13]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[13]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[13]['name'],
                selector: row => row[columnData[13]['dataRef2']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[13]['omitperGP'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[14]['name'],
                selector: row => row[columnData[14]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[14]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[14]['name'],
                selector: row => row[columnData[14]['dataRef2']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[14]['omitperGP'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[15]['name'],
                selector: row => row[columnData[15]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[15]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[15]['name'],
                selector: row => row[columnData[15]['dataRef2']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[15]['omitperGP'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[16]['name'],
                selector: row => row[columnData[16]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[16]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[16]['name'],
                selector: row => row[columnData[16]['dataRef2']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[16]['omitperGP'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[17]['name'],
                selector: row => row[columnData[17]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[17]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[17]['name'],
                selector: row => row[columnData[17]['dataRef2']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[17]['omitperGP'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[18]['name'],
                selector: row => row[columnData[18]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[18]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[18]['name'],
                selector: row => row[columnData[18]['dataRef2']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[18]['omitperGP'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[19]['name'],
                selector: row => row[columnData[19]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[19]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[19]['name'],
                selector: row => row[columnData[19]['dataRef2']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[19]['omitperGP'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[20]['name'],
                selector: row => row[columnData[20]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[20]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[20]['name'],
                selector: row => row[columnData[20]['dataRef2']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[20]['omitperGP'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                { // GAA
                name: columnData[21]['name'],
                selector: row => row[columnData[21]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[21]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[22]['name'],
                selector: row => row[columnData[22]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[22]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[22]['name'],
                selector: row => row[columnData[22]['dataRef2']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[22]['omitperGP'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[23]['name'],
                selector: row => row[columnData[23]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[23]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[23]['name'],
                selector: row => row[columnData[23]['dataRef2']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[23]['omitperGP'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {  // SV%
                name: columnData[24]['name'],
                selector: row => row[columnData[24]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[24]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[25]['name'],
                selector: row => row[columnData[25]['dataRef1']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[25]['omitTotal'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                },
                {
                name: columnData[25]['name'],
                selector: row => row[columnData[25]['dataRef2']],
                sortable: true,
                width: dataColWidth01,
                omit: columnData[25]['omitperGP'],
                style: {
                    borderRight: "1px dotted #616161"
                }
                }
        ]
    }


  
    
    useEffect(() => {
        if (checkIfNewDataNecessary()) {
            console.log('getting data from api')
            const t0 = new Date().getTime()
            fetchPlayerData()
                .then(data => {
                    if (data) {
                        const t1 = new Date().getTime()
                        data.responseTime = `${t1-t0} ms`
                        // redis.set(`playerData`, data) 
                        setTableData(data)
                    } else if (!data) {
                        console.log('no data! Uh oh!')
                    }
                })
                .catch(console.error)
        } else {
            console.log('NOT getting data from api')
        }
          
        }, [season, showPerGP, tablePosFilter])


    return (

        <section className={styles.playerData}>     

            <h2>NHL Fantasy Raw Data</h2>
            <div className="playerDataControlMenu">
            <div className="form_group_container">
                <Stack direction="row" spacing={2}>
                <Controller
                name="tablePosFilter"
                control={control}
                defaultValue="None"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <FormControl className="mui_select">
                        <InputLabel id="tablePosFilter-select">Position Filter</InputLabel>
                        <Select
                        labelId="tablePosFilter-select"
                        label="Position Filter"
                        sx={{ width: 250 }}
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        // helperText={error ? error.message : null}
                        >
                            <MenuItem value={'None'}>None</MenuItem>
                            <MenuItem value={'C'}>C</MenuItem>
                            <MenuItem value={'LW'}>LW</MenuItem>
                            <MenuItem value={'RW'}>RW</MenuItem>
                            <MenuItem value={'D'}>D</MenuItem>
                            <MenuItem value={'G'}>G</MenuItem>
                        </Select>
                    </FormControl>
                )}
                // rules={{ required: 'Fantasy Site required' }}
                />
                <Controller
                name="seasonSelect"
                control={control}
                defaultValue="21-22"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <FormControl className="mui_select">
                        <InputLabel id="seasonSelect-select">Select Season</InputLabel>
                        <Select
                        labelId="seasonSelect-select"
                        label="Select Season"
                        sx={{ width: 250 }}
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        // helperText={error ? error.message : null}
                        >
                            <MenuItem value={'19-20'}>19-20</MenuItem>
                            <MenuItem value={'20-21'}>20-21</MenuItem>
                            <MenuItem value={'21-22'}>21-22</MenuItem>
                        </Select>
                    </FormControl>
                    )}
                />
                <FormControl component="fieldset">
                    <FormGroup aria-label="position" row>
                    {/* <FormLabel component="legend">Table Controls</FormLabel> */}
                    <FormControlLabel
                        control={
                            <Switch 
                            checked={showPerGP} 
                            onChange={() => setShowPerGP(!showPerGP)}
                            name="totals" />
                        }
                        label="Totals / perGP"
                        labelPlacement="top"
                        />
                        {/* 
                        TODO: Add this functionality
                        Issue rendering using both hidePosRnk AND showPerGP toggles
                        */}
                        {/* <FormControlLabel
                        label="Show Position Ranks"
                        labelPlacement="top"
                        control={
                            <Checkbox 
                            defaultChecked
                            checked={!hidePosRnk}
                            onChange={() => setHidePosRnk(!hidePosRnk)}
                            inputProps={{ 'aria-label': 'controlled' }}  
                            />
                        }
                        /> */}
                        {/* <FormControlLabel
                        label="Show ADP"
                        labelPlacement="top"
                        control={
                            <Checkbox 
                            checked={!hideADP}
                            onChange={() => setHideADP(!hideADP)}
                            inputProps={{ 'aria-label': 'controlled' }}  
                            />
                        }
                        /> */}
                        {/* <Button variant="contained" onClick={() => setHidePosRnk(!hidePosRnk)}>Toggle Pos-Rank Column</Button>
                        <Button variant="contained" onClick={() => setHideADP(!hideADP)}>Toggle ADP Columns</Button> */}
                    </FormGroup>
                </FormControl>
    
                </Stack>
            </div>
            </div>
            <h3>
            {showPerGP ? 'Per Game' : 'Totals'}
            { tablePosFilter == "None" ? " - All Position VORPs" : " - " + tablePosFilter + " VORP"}
            </h3>
    
            <div className={styles.dataTableContainer}>

                { loading ? (
                    <p className="subtext">DataTable Loading...</p>
                ) : (
                    <DataTable
                    title={"Table Title TODO"}
                    columns={columns}
                    data={finalTableData}  // filteredItems
                    customStyles={customRDTStyles}
                    conditionalRowStyles={specificRDTStyles}
                    className="dataTable"
                    defaultSortFieldId="InitialSort"
                    defaultSortAsc={false}
                    responsive
                    dense
                    direction="auto"
                    fixedHeader
                    noHeader
                    // fixedHeaderScrollHeight="300px"
                    highlightOnHover
                    pagination
                    paginationPerPage={100}
                    // selectAllRowsItem true
                    // selectableRows
                    selectableRowsHighlight
                    selectableRowsRadio="checkbox"
                    striped // Not currently working lol
                    // FILTERING  vvv
                    // subHeader
                    // subHeaderWrap
                    // subHeaderAlign="right"
                    // subHeaderComponent={subHeaderComponentMemo}
                    // persistTableHead
                    // paginationResetDefaultPage={resetPaginationToggle} 
                    />
                )}
            { !playerData ? "No player data available." : "" }
            
        </div>
    </section>


    )
}
