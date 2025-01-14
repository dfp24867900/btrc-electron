export default {
  master: {
    cpu_usage: 'CPU Usage',
    memory_usage: 'Memory Usage',
    disk_available: 'Disk Available',
    load_average: 'Load Average',
    create_time: 'Create Time',
    last_heartbeat_time: 'Last Heartbeat Time',
    directory_detail: 'Directory Detail',
    host: 'Host',
    directory: 'Directory',
    master_no_data_result_title: 'No Master Nodes Exist',
    master_no_data_result_desc:
      'Currently, there are no master nodes exist, please create a master node and refresh this page'
  },
  worker: {
    cpu_usage: 'CPU Usage',
    memory_usage: 'Memory Usage',
    disk_available: 'Disk Available',
    load_average: 'Load Average',
    create_time: 'Create Time',
    last_heartbeat_time: 'Last Heartbeat Time',
    directory_detail: 'Directory Detail',
    host: 'Host',
    directory: 'Directory',
    worker_no_data_result_title: 'No Worker Nodes Exist',
    worker_no_data_result_desc:
      'Currently, there are no worker nodes exist, please create a worker node and refresh this page'
  },
  db: {
    health_state: 'Health State',
    max_connections: 'Max Connections',
    threads_connections: 'Threads Connections',
    threads_running_connections: 'Threads Running Connections',
    db_no_data_result_title: 'No DB Nodes Exist',
    db_no_data_result_desc:
      'Currently, there are no DB nodes exist, please create a DB node and refresh this page'
  },
  statistics: {
    command_number_of_waiting_for_running:
      'Command Number Of Waiting For Running',
    failure_command_number: 'Failure Command Number'
  },
  audit_log: {
    user_name: 'User Name',
    resource_type: 'Resource Type',
    project_name: 'Project Name',
    operation_type: 'Operation Type',
    create_time: 'Create Time',
    start_time: 'Start Time',
    end_time: 'End Time',
    user_audit: 'User Audit',
    project_audit: 'Project Audit',
    create: 'Create',
    update: 'Update',
    delete: 'Delete',
    read: 'Read'
  }
}
