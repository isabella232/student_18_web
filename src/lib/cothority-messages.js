import protobuf from 'protobufjs';

const {Type, Field, MapField} = protobuf;

const StatusResponse = new Type('StatusResponse')
  .add(new MapField('system', 1, 'string', 'Status'))
  .add(new Field('server', 2, 'ServerIdentity'));

const {Type: Type$1, MapField: MapField$1} = protobuf;

const status = new Type$1('Status')
  .add(new MapField$1('field', 1, 'string', 'string'));

const {Type: Type$2, Field: Field$1} = protobuf;

const serverIdentity = new Type$2('ServerIdentity')
  .add(new Field$1('public', 1, 'bytes'))
  .add(new Field$1('id', 2, 'bytes'))
  .add(new Field$1('address', 3, 'string'))
  .add(new Field$1('description', 4, 'string'));

const {Type: Type$3, Field: Field$2} = protobuf;

const roster = new Type$3("Roster")
  .add(new Field$2('id', 1, 'bytes'))
  .add(new Field$2('list', 2, 'ServerIdentity', 'repeated'))
  .add(new Field$2('aggregate', 3, 'bytes'));

const {Type: Type$4, Field: Field$3} = protobuf;

const signatureRequest = new Type$4("SignatureRequest")
  .add(new Field$3('message', 1, 'bytes'))
  .add(new Field$3('roster', 2, 'Roster'));

const {Type: Type$5, Field: Field$4} = protobuf;

const signatureResponse = new Type$5("SignatureResponse")
  .add(new Field$4('hash', 1, 'bytes', 'required'))
  .add(new Field$4('signature', 2, 'bytes', 'required'));

const {Type: Type$6, Field: Field$5} = protobuf;

const StoreSkipBlockRequest = new Type$6("StoreSkipBlockRequest")
  .add(new Field$5('LatestID', 1, 'bytes'))
  .add(new Field$5('NewBlock', 2, 'SkipBlock'));

const {Type: Type$7, Field: Field$6} = protobuf;

const StoreSkipBlockResponse = new Type$7("StoreSkipBlockResponse")
  .add(new Field$6('Previous', 1, 'SkipBlock'))
  .add(new Field$6('Latest', 2, 'SkipBlock'));

const {Type: Type$8, Field: Field$7} = protobuf;

const LatestBlockRequest = new Type$8("LatestBlockRequest")
  .add(new Field$7('LatestID', 1, 'bytes'));

const {Type: Type$9, Field: Field$8} = protobuf;

const LatestBlockResponse = new Type$9("LatestBlockResponse")
  .add(new Field$8('Update', 1, 'SkipBlock', 'repeated'));

const {Type: Type$10, Field: Field$9} = protobuf;

const SkipBlock = new Type$10("SkipBlock")
  .add(new Field$9('Index', 1, 'sint32'))
  .add(new Field$9('Height', 2, 'sint32'))
  .add(new Field$9('MaximumHeight', 3, 'sint32'))
  .add(new Field$9('BaseHeight', 4, 'sint32'))
  .add(new Field$9('BackLinkIDs', 5, 'bytes', 'repeated'))
  .add(new Field$9('VerifierIDs', 6, 'bytes', 'repeated'))
  .add(new Field$9('ParentBlockID', 7, 'bytes'))
  .add(new Field$9('GenesisID', 8, 'bytes'))
  .add(new Field$9('Data', 9, 'bytes'))
  .add(new Field$9('Roster', 10, 'Roster'))
  .add(new Field$9('Hash', 11, 'bytes'))
  .add(new Field$9('ForwardLink', 12, 'BlockLink', 'repeated'))
  .add(new Field$9('ChildSL', 13, 'bytes'));

const {Type: Type$11, Field: Field$10} = protobuf;

const BlockLink = new Type$11("BlockLink")
  .add(new Field$10('Hash', 1, 'bytes'))
  .add(new Field$10('Signature', 2, 'bytes'));

const {Root} = protobuf;

const root = new Root();
root.define("cothority")
  .add(SkipBlock)
  .add(serverIdentity)
  .add(roster)
  .add(BlockLink)
  .add(LatestBlockRequest)
  .add(LatestBlockResponse)
  .add(StoreSkipBlockRequest)
  .add(StoreSkipBlockResponse)
  .add(status)
  .add(StatusResponse)
  .add(signatureRequest)
  .add(signatureResponse);

class CothorityProtobuf {
  
  constructor() {
    this.root = root;
  }
  
  /**
   * Encode a model to be transmitted over websocket
   * @param name
   * @param fields
   * @returns {*|Buffer|Uint8Array}
   */
  encodeMessage(name, fields) {
    const model = this.getModel(name);
    
    // Create the message with the model
    const msg = model.create(fields);

    // Encode the message in a BufferArray
    return model.encode(msg).finish();
  }
  
  /**
   * Decode a message coming from a websocket
   * @param name
   * @param buffer
   */
  decodeMessage(name, buffer) {
    const model = this.getModel(name);
    return model.decode(buffer);
  }
  
  /**
   * Return the protobuf loaded model
   * @param name
   * @returns {ReflectionObject|?ReflectionObject|string}
   */
  getModel(name) {
    return this.root.lookup(`cothority.${name}`);
  }
}

class CothorityMessages extends CothorityProtobuf {
  
  /**
   * Create an encoded message to make a sign request to a cothority node
   * @param message to sign stored in a Uint8Array
   * @param servers list of ServerIdentity
   * @returns {*|Buffer|Uint8Array}
   */
  createSignatureRequest(message, servers) {
    if (!(message instanceof Uint8Array)) {
      throw new Error("message must be a instance of Uint8Array");
    }
    
    const fields = {
      message,
      roster: {
        list: servers
      }
    };
    
    return this.encodeMessage('SignatureRequest', fields);
  }
  
  /**
   * Return the decoded response
   * @param response
   * @returns {*}
   */
  decodeSignatureResponse(response) {
    response = new Uint8Array(response);

    return this.decodeMessage('SignatureResponse', response);
  }
  
  /**
   * Return the decoded response
   * @param response
   * @returns {*}
   */
  decodeStatusResponse(response) {
    response = new Uint8Array(response);

    return this.decodeMessage('StatusResponse', response);
  }

  createStoreSkipBlockRequest(id, servers) {
    if (!(id instanceof Uint8Array)) {
      throw new Error("message must be a instance of Uint8Array");
    }

    return this.encodeMessage('StoreSkipBlockRequest', {
      LatestID: id,
      NewBlock: {
        MaximumHeight: 1,
        BaseHeight: 1,
        Data: new Uint8Array([]),
        Roster: {
          list: servers
        }
      }
    });
  }

  decodeStoreSkipBlockResponse(response) {
    response = new Uint8Array(response);

    return this.decodeMessage('StoreSkipBlockResponse', response);
  }

  createLatestBlockRequest(id) {
    if (!(id instanceof Uint8Array)) {
      throw new Error("message must be a instance of Uint8Array");
    }

    return this.encodeMessage('LatestBlockRequest', {
      LatestID: id
    });
  }

  decodeLatestBlockResponse(response) {
    response = new Uint8Array(response);

    return this.decodeMessage('LatestBlockResponse', response);
  }
  
}

var index = new CothorityMessages();

export default index;
